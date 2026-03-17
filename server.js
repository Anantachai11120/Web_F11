require('dotenv').config();
const express = require('express');
const next = require('next');
const nodemailer = require('nodemailer');
const mysql = require('mysql2/promise');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const dns = require('dns').promises;

const app = express();
const port = Number(process.env.PORT || 3000);
const dataDir = path.join(__dirname, 'data');
const approvalsPath = path.join(dataDir, 'booking-approvals.json');
const equipmentReturnsPath = path.join(dataDir, 'equipment-returns.json');
const sharedStatePath = path.join(dataDir, 'shared-state.json');
const sharedStateBackupPath = path.join(dataDir, 'shared-state.backup.json');
const uploadsDir = path.join(dataDir, 'uploads');
const nextWorkDir = path.join(dataDir, 'next-work');
const traceFallbackDir = path.join(nextWorkDir, 'runtime-trace');
const sharedStateKeys = new Set([
  'lab_users',
  'lab_room_bookings',
  'lab_equipment_bookings',
  'lab_equipment_items',
  'lab_equipment_types',
  'lab_announcements',
  'lab_home_info',
  'lab_responsible_staff',
  'lab_room_closures',
  'lab_room_zone_map',
  'lab_notifications',
]);
const dbEnabled = Boolean(process.env.DB_HOST && process.env.DB_USER && process.env.DB_NAME);
const requireDb = process.env.REQUIRE_DB
  ? String(process.env.REQUIRE_DB).toLowerCase() === 'true'
  : process.env.NODE_ENV === 'production';
let dbPool = null;
const DB_KEYS = {
  approvals: 'booking_approvals',
  equipmentReturns: 'equipment_returns',
  sharedState: 'shared_state',
};
const uploadCategories = new Set([
  'announcements',
  'projects',
  'staff',
  'equipment',
  'profiles',
  'room-zones',
  'room-maps',
  'proofs',
]);

const getDbPool = () => dbPool;

const initDb = async () => {
  if (!dbEnabled) return false;
  dbPool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: Number(process.env.DB_POOL_SIZE || 10),
    queueLimit: 0,
    charset: 'utf8mb4',
  });
  const conn = await dbPool.getConnection();
  try {
    await conn.query(`
      CREATE TABLE IF NOT EXISTS app_kv (
        k VARCHAR(128) NOT NULL PRIMARY KEY,
        v LONGTEXT NOT NULL,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
  } finally {
    conn.release();
  }
  return true;
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
};

const sanitizeUploadCategory = (value) => {
  const normalized = String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return uploadCategories.has(normalized) ? normalized : 'misc';
};

const sanitizeFileNameBase = (value, fallback = 'image') => {
  const normalized = String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
  return normalized || fallback;
};

const parseDataUrlImage = (dataUrl) => {
  const match = String(dataUrl || '').match(/^data:(image\/(?:png|jpeg|jpg|webp|gif));base64,([a-z0-9+/=\s]+)$/i);
  if (!match) return null;
  const mime = String(match[1] || '').toLowerCase();
  const base64 = String(match[2] || '').replace(/\s+/g, '');
  const extMap = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/webp': 'webp',
    'image/gif': 'gif',
  };
  const ext = extMap[mime];
  if (!ext) return null;
  const buffer = Buffer.from(base64, 'base64');
  if (!buffer.length || buffer.length > 8 * 1024 * 1024) return null;
  return { mime, ext, buffer };
};

const initDbWithRetry = async (attempts = 20, delayMs = 1500) => {
  let lastErr = null;
  for (let i = 1; i <= attempts; i += 1) {
    try {
      await initDb();
      return true;
    } catch (err) {
      lastErr = err;
      console.warn(`MySQL connect attempt ${i}/${attempts} failed: ${err.message || err}`);
      await sleep(delayMs);
    }
  }
  throw lastErr || new Error('db_connect_failed');
};

const dbReadJson = async (key, fallbackValue) => {
  if (!dbEnabled || !getDbPool()) return null;
  try {
    const [rows] = await getDbPool().query('SELECT v FROM app_kv WHERE k = ? LIMIT 1', [key]);
    if (!rows.length) return null;
    const parsed = JSON.parse(String(rows[0].v || 'null'));
    return parsed ?? fallbackValue;
  } catch {
    return null;
  }
};

const dbWriteJson = async (key, value) => {
  if (!dbEnabled || !getDbPool()) return false;
  try {
    await getDbPool().query(
      'INSERT INTO app_kv (k, v) VALUES (?, ?) ON DUPLICATE KEY UPDATE v = VALUES(v), updated_at = CURRENT_TIMESTAMP',
      [key, JSON.stringify(value)]
    );
    return true;
  } catch (err) {
    console.error('dbWriteJson error:', err.message || err);
    return false;
  }
};

const migrateFileDataToDbIfNeeded = async () => {
  if (!dbEnabled || !getDbPool()) return;

  const migrateOne = async (dbKey, filePath, pickItems) => {
    const existing = await dbReadJson(dbKey, null);
    if (existing !== null) return;
    try {
      if (!fs.existsSync(filePath)) return;
      const raw = fs.readFileSync(filePath, 'utf8');
      const parsed = JSON.parse(raw);
      const payload = pickItems(parsed);
      await dbWriteJson(dbKey, payload);
    } catch {
      // skip invalid legacy file
    }
  };

  await migrateOne(DB_KEYS.approvals, approvalsPath, (parsed) => (Array.isArray(parsed?.items) ? parsed.items : []));
  await migrateOne(
    DB_KEYS.equipmentReturns,
    equipmentReturnsPath,
    (parsed) => (Array.isArray(parsed?.items) ? parsed.items : [])
  );
  await migrateOne(
    DB_KEYS.sharedState,
    sharedStatePath,
    (parsed) => (parsed && typeof parsed.items === 'object' && !Array.isArray(parsed.items) ? parsed.items : {})
  );
};

const nativeCreateWriteStream = fs.createWriteStream.bind(fs);
fs.createWriteStream = (targetPath, ...args) => {
  try {
    const resolved = path.resolve(String(targetPath || ''));
    if (/[\\\/]\.next[\\\/]trace$/i.test(resolved)) {
      if (!fs.existsSync(traceFallbackDir)) fs.mkdirSync(traceFallbackDir, { recursive: true });
      const fallbackPath = path.join(traceFallbackDir, 'trace');
      return nativeCreateWriteStream(fallbackPath, ...args);
    }
  } catch {
    // fallback to native stream
  }
  return nativeCreateWriteStream(targetPath, ...args);
};

app.use(express.json({ limit: '10mb' }));

app.disable('x-powered-by');
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'same-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  next();
});

const sanitizePayload = (input) => {
  if (typeof input === 'string') {
    const trimmed = input.replace(/[\u0000-\u001F\u007F]/g, ' ').trim();
    if (trimmed.startsWith('data:image/')) return trimmed.slice(0, 9_000_000);
    return trimmed.slice(0, 20_000);
  }
  if (Array.isArray(input)) return input.map((v) => sanitizePayload(v));
  if (input && typeof input === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(input)) out[k] = sanitizePayload(v);
    return out;
  }
  return input;
};

const rateStore = new Map();
const isRateLimited = (key, windowMs, maxHits) => {
  const now = Date.now();
  const windowStart = now - windowMs;
  const hits = (rateStore.get(key) || []).filter((t) => t > windowStart);
  hits.push(now);
  rateStore.set(key, hits);
  return hits.length > maxHits;
};

app.use('/api', (req, res, next) => {
  req.body = sanitizePayload(req.body);
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const key = `${String(ip)}:${req.path}`;
  const strictRoute = req.path.startsWith('/send-') || req.path === '/validate-register-email';
  const limited = isRateLimited(key, 60_000, strictRoute ? 12 : 120);
  if (limited) {
    return res.status(429).json({ ok: false, message: 'too_many_requests' });
  }
  return next();
});

app.post('/api/upload-image', (req, res) => {
  try {
    const category = sanitizeUploadCategory(req.body?.category);
    const filenameBase = sanitizeFileNameBase(req.body?.filenameBase, category);
    const parsed = parseDataUrlImage(req.body?.dataUrl);
    if (!parsed) {
      return res.status(400).json({ ok: false, message: 'invalid_image_data' });
    }
    const dir = path.join(uploadsDir, category);
    ensureDir(dir);
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const token = crypto.randomBytes(6).toString('hex');
    const fileName = `${filenameBase}-${stamp}-${token}.${parsed.ext}`;
    const fullPath = path.join(dir, fileName);
    fs.writeFileSync(fullPath, parsed.buffer);
    return res.json({
      ok: true,
      path: `/uploads/${category}/${fileName}`,
      size: parsed.buffer.length,
      mime: parsed.mime,
    });
  } catch (error) {
    return res.status(500).json({ ok: false, message: error?.message || 'upload_failed' });
  }
});

const tempMailDomains = new Set([
  'mailinator.com',
  'guerrillamail.com',
  '10minutemail.com',
  'yopmail.com',
  'tempmail.com',
  'trashmail.com',
  'getnada.com',
  'sharklasers.com',
  'dispostable.com',
  'maildrop.cc',
  'fakeinbox.com',
  'temp-mail.org',
  'tempmailo.com',
]);

const waitTimeout = (ms, fallback = null) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(fallback), ms);
  });

const validateRegisterEmail = async (rawEmail) => {
  const email = String(rawEmail || '').trim().toLowerCase();
  const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
  if (!emailPattern.test(email)) {
    return { ok: false, reason: 'invalid_format' };
  }
  if (email.length > 254) {
    return { ok: false, reason: 'invalid_format' };
  }
  const at = email.lastIndexOf('@');
  const domain = at > -1 ? email.slice(at + 1) : '';
  if (!domain || domain.length < 4 || domain.includes('..') || domain.startsWith('.') || domain.endsWith('.')) {
    return { ok: false, reason: 'invalid_format' };
  }
  if (tempMailDomains.has(domain)) {
    return { ok: false, reason: 'disposable_domain' };
  }
  if (domain === 'localhost' || domain.endsWith('.local') || domain.endsWith('.invalid') || domain.endsWith('.test')) {
    return { ok: false, reason: 'invalid_domain' };
  }

  try {
    const mxResult = await Promise.race([
      dns.resolveMx(domain),
      waitTimeout(2500, []),
    ]);
    if (Array.isArray(mxResult) && mxResult.length > 0) {
      return { ok: true, email, domain };
    }
  } catch {
    // fallback to A/AAAA check
  }

  try {
    const hostResult = await Promise.race([
      Promise.any([dns.resolve4(domain), dns.resolve6(domain)]),
      waitTimeout(2500, []),
    ]);
    if (Array.isArray(hostResult) && hostResult.length > 0) {
      return { ok: true, email, domain };
    }
  } catch {
    // no DNS record
  }

  return { ok: false, reason: 'domain_not_found' };
};

const requiredEnv = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'MAIL_FROM'];
const missing = requiredEnv.filter((k) => !process.env[k]);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: Number(process.env.SMTP_PORT || 587) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const CP1252_REVERSE = new Map([
  [0x20ac, 0x80], [0x201a, 0x82], [0x0192, 0x83], [0x201e, 0x84], [0x2026, 0x85],
  [0x2020, 0x86], [0x2021, 0x87], [0x02c6, 0x88], [0x2030, 0x89], [0x0160, 0x8a],
  [0x2039, 0x8b], [0x0152, 0x8c], [0x017d, 0x8e], [0x2018, 0x91], [0x2019, 0x92],
  [0x201c, 0x93], [0x201d, 0x94], [0x2022, 0x95], [0x2013, 0x96], [0x2014, 0x97],
  [0x02dc, 0x98], [0x2122, 0x99], [0x0161, 0x9a], [0x203a, 0x9b], [0x0153, 0x9c],
  [0x017e, 0x9e], [0x0178, 0x9f],
]);

const decodeCp1252Utf8Once = (text) => {
  const bytes = [];
  for (const ch of text) {
    const code = ch.codePointAt(0);
    if (code <= 0xff) {
      bytes.push(code);
      continue;
    }
    const mapped = CP1252_REVERSE.get(code);
    if (mapped === undefined) return text;
    bytes.push(mapped);
  }
  return Buffer.from(bytes).toString('utf8');
};

const repairMojibake = (value) => {
  if (typeof value !== 'string' || !/[ÃÂ]/.test(value)) return value;
  let out = value;
  for (let i = 0; i < 5; i += 1) {
    if (!/[ÃÂ]/.test(out)) break;
    const decoded = decodeCp1252Utf8Once(out);
    if (!decoded || decoded === out) break;
    out = decoded;
  }
  return out;
};

const sendMailUtf8 = async (options) => {
  const safe = { ...options };
  if (typeof safe.subject === 'string') safe.subject = repairMojibake(safe.subject);
  if (typeof safe.text === 'string') safe.text = repairMojibake(safe.text);
  if (typeof safe.html === 'string') safe.html = repairMojibake(safe.html);
  return transporter.sendMail(safe);
};

const attachmentFromDataUrl = (dataUrl, fallbackName = 'proof.jpg') => {
  const raw = String(dataUrl || '').trim();
  const hit = raw.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!hit) return null;
  const mime = hit[1];
  const base64 = hit[2];
  let ext = 'jpg';
  if (mime.includes('png')) ext = 'png';
  else if (mime.includes('webp')) ext = 'webp';
  else if (mime.includes('gif')) ext = 'gif';
  return {
    filename: fallbackName.replace(/\.(jpg|jpeg|png|webp|gif)$/i, `.${ext}`),
    content: base64,
    encoding: 'base64',
    contentType: mime,
  };
};

const ensureApprovalsStore = () => {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(approvalsPath)) {
    fs.writeFileSync(approvalsPath, JSON.stringify({ items: [] }, null, 2), 'utf8');
  }
};

const ensureEquipmentReturnsStore = () => {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(equipmentReturnsPath)) {
    fs.writeFileSync(equipmentReturnsPath, JSON.stringify({ items: [] }, null, 2), 'utf8');
  }
};

const readApprovals = async () => {
  const dbItems = await dbReadJson(DB_KEYS.approvals, []);
  if (Array.isArray(dbItems)) return dbItems;
  ensureApprovalsStore();
  try {
    const raw = fs.readFileSync(approvalsPath, 'utf8');
    const parsed = JSON.parse(raw);
    const items = Array.isArray(parsed.items) ? parsed.items : [];
    await dbWriteJson(DB_KEYS.approvals, items);
    return items;
  } catch {
    return [];
  }
};

const writeApprovals = async (items) => {
  await dbWriteJson(DB_KEYS.approvals, items);
  ensureApprovalsStore();
  fs.writeFileSync(approvalsPath, JSON.stringify({ items }, null, 2), 'utf8');
};

const readEquipmentReturns = async () => {
  const dbItems = await dbReadJson(DB_KEYS.equipmentReturns, []);
  if (Array.isArray(dbItems)) return dbItems;
  ensureEquipmentReturnsStore();
  try {
    const raw = fs.readFileSync(equipmentReturnsPath, 'utf8');
    const parsed = JSON.parse(raw);
    const items = Array.isArray(parsed.items) ? parsed.items : [];
    await dbWriteJson(DB_KEYS.equipmentReturns, items);
    return items;
  } catch {
    return [];
  }
};

const writeEquipmentReturns = async (items) => {
  await dbWriteJson(DB_KEYS.equipmentReturns, items);
  ensureEquipmentReturnsStore();
  fs.writeFileSync(equipmentReturnsPath, JSON.stringify({ items }, null, 2), 'utf8');
};

const ensureSharedStateStore = () => {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(sharedStatePath)) {
    fs.writeFileSync(sharedStatePath, JSON.stringify({ items: {} }, null, 2), 'utf8');
  }
};

const readSharedState = async () => {
  const dbItems = await dbReadJson(DB_KEYS.sharedState, {});
  if (dbItems && typeof dbItems === 'object' && !Array.isArray(dbItems)) return dbItems;
  ensureSharedStateStore();
  const parseItems = (raw) => {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null;
    const items = parsed.items;
    if (!items || typeof items !== 'object' || Array.isArray(items)) return null;
    return items;
  };
  try {
    const raw = fs.readFileSync(sharedStatePath, 'utf8');
    const items = parseItems(raw);
    if (items && Object.keys(items).length) return items;
  } catch {
    // try backup file
  }
  try {
    if (!fs.existsSync(sharedStateBackupPath)) return {};
    const rawBackup = fs.readFileSync(sharedStateBackupPath, 'utf8');
    const backupItems = parseItems(rawBackup);
    if (!backupItems) return {};
    // auto-heal main file from backup when current file is invalid/empty.
    try {
      fs.writeFileSync(sharedStatePath, JSON.stringify({ items: backupItems }, null, 2), 'utf8');
    } catch {
      // ignore heal write error
    }
    await dbWriteJson(DB_KEYS.sharedState, backupItems);
    return backupItems;
  } catch {
    return {};
  }
};

const writeSharedState = async (items) => {
  await dbWriteJson(DB_KEYS.sharedState, items);
  ensureSharedStateStore();
  try {
    if (fs.existsSync(sharedStatePath)) {
      fs.copyFileSync(sharedStatePath, sharedStateBackupPath);
    }
  } catch {
    // keep writing main file even if backup copy fails
  }
  fs.writeFileSync(sharedStatePath, JSON.stringify({ items }, null, 2), 'utf8');
};

const upsertPendingRequest = async (payload) => {
  const items = await readApprovals();
  const index = items.findIndex((i) => i.bookingId === payload.bookingId);
  if (index >= 0) {
    items[index] = { ...items[index], ...payload };
  } else {
    items.push(payload);
  }
  await writeApprovals(items);
};

const getConfirmToken = () => crypto.randomBytes(24).toString('hex');

const upsertEquipmentReturnRequest = async (payload) => {
  const items = await readEquipmentReturns();
  const index = items.findIndex((i) => i.bookingId === payload.bookingId);
  if (index >= 0) {
    items[index] = { ...items[index], ...payload };
  } else {
    items.push(payload);
  }
  await writeEquipmentReturns(items);
};

const confirmEquipmentReturn = async (bookingId, options = {}) => {
  const notifyRequester = options.notifyRequester !== false;
  const items = await readEquipmentReturns();
  const target = items.find((i) => i.bookingId === bookingId);
  if (!target) return { ok: false, message: 'return_request_not_found' };

  if (target.status !== 'returned') {
    target.status = 'returned';
    target.confirmedAt = new Date().toISOString();
    target.confirmedBy = 'responsible';
    await writeEquipmentReturns(items);

    if (notifyRequester && target.requesterEmail) {
      try {
        const subject = `Equipment Return Confirmed: ${target.item || '-'}`;
        const text = [
          'Your equipment return has been confirmed.',
          `Item: ${target.item || '-'}`,
          `Quantity: ${target.quantity || '-'}`,
          `Date: ${target.date || '-'}`,
          `Time: ${target.timeSlot || '-'}`,
        ].join('\n');
        const html = `
          <div style="font-family:Arial,sans-serif;line-height:1.6">
            <h3>Equipment Return Confirmed</h3>
            <p>Your equipment return has been confirmed.</p>
            <ul>
              <li>Item: ${target.item || '-'}</li>
              <li>Quantity: ${target.quantity || '-'}</li>
              <li>Date: ${target.date || '-'}</li>
              <li>Time: ${target.timeSlot || '-'}</li>
            </ul>
          </div>
        `;
        await sendMailUtf8({ from: process.env.MAIL_FROM, to: target.requesterEmail, subject, text, html });
      } catch (err) {
        console.error('notify return confirm mail error:', err.message || err);
      }
    }
  }
  return { ok: true };
};

const confirmEquipmentReturnBatch = async (bookingIds) => {
  const ids = Array.isArray(bookingIds)
    ? bookingIds.map((v) => String(v || '').trim()).filter(Boolean)
    : [];
  if (!ids.length) return { ok: false, message: 'bookingIds_required' };

  const all = await readEquipmentReturns();
  const selected = all.filter((i) => ids.includes(String(i.bookingId || '')));
  if (!selected.length) return { ok: false, message: 'return_request_not_found' };

  for (const id of ids) {
    // eslint-disable-next-line no-await-in-loop
    const result = await confirmEquipmentReturn(id, { notifyRequester: false });
    if (!result.ok) return result;
  }

  const requesterEmail = selected[0]?.requesterEmail || '';
  if (requesterEmail) {
    const itemRows = selected
      .map((s) => `- ${s.item || '-'} x ${s.quantity || '-'} (${s.date || '-'} ${s.timeSlot || '-'})`)
      .join('\n');
    const subject = 'Equipment Return Confirmed';
    const text = `Your equipment return has been confirmed.\n\n${itemRows}`;
    const html = `
      <div style="font-family:Arial,sans-serif;line-height:1.6">
        <h3>Equipment Return Confirmed</h3>
        <p>Your equipment return has been confirmed.</p>
        <pre style="white-space:pre-wrap">${itemRows}</pre>
      </div>
    `;
    try {
      await sendMailUtf8({ from: process.env.MAIL_FROM, to: requesterEmail, subject, text, html });
    } catch (err) {
      console.error('notify batch return confirm mail error:', err.message || err);
    }
  }

  return { ok: true };
};

const applyBookingDecision = async (bookingId, decision) => {
  const normalized = decision === 'rejected' ? 'rejected' : 'approved';
  const items = await readApprovals();
  const target = items.find((i) => i.bookingId === bookingId);
  if (!target) return { ok: false, message: 'booking_not_found' };

  if (target.status !== normalized) {
    target.status = normalized;
    if (normalized === 'approved') {
      target.approvedAt = new Date().toISOString();
      target.approvedBy = 'responsible';
    } else {
      target.rejectedAt = new Date().toISOString();
      target.rejectedBy = 'responsible';
    }
    await writeApprovals(items);

    if (target.requesterEmail) {
      const subject = normalized === 'approved'
        ? `Booking Approved: ${target.room || 'Lab'}`
        : `Booking Rejected: ${target.room || 'Lab'}`;
      const text = [
        normalized === 'approved' ? 'Your room booking is approved.' : 'Your room booking is rejected.',
        `Room: ${target.room || '-'}`,
        `Date: ${target.date || '-'}`,
        `Time: ${target.timeSlot || '-'}`,
        `Purpose: ${target.purpose || '-'}`,
      ].join('\n');
      const html = `
        <div style="font-family:Arial,sans-serif;line-height:1.6">
          <h3>${normalized === 'approved' ? 'Booking Approved' : 'Booking Rejected'}</h3>
          <p>${normalized === 'approved' ? 'Your room booking is approved.' : 'Your room booking is rejected.'}</p>
          <ul>
            <li>Room: ${target.room || '-'}</li>
            <li>Date: ${target.date || '-'}</li>
            <li>Time: ${target.timeSlot || '-'}</li>
            <li>Purpose: ${target.purpose || '-'}</li>
          </ul>
        </div>
      `;
      try {
        await sendMailUtf8({ from: process.env.MAIL_FROM, to: target.requesterEmail, subject, text, html });
      } catch (err) {
        console.error('confirm notify mail error:', err.message || err);
      }
    }
  }

  return { ok: true };
};
app.post('/api/send-booking-email', async (req, res) => {
  try {
    if (missing.length) {
      return res.status(500).json({
        ok: false,
        message: `Missing env: ${missing.join(', ')}`,
      });
    }

    const {
      responsibleEmail,
      responsibleName,
      requesterName,
      member1,
      member2,
      purpose,
      date,
      timeSlot,
      room,
      bookingId,
      baseUrl,
      requesterEmail,
    } = req.body || {};

    if (!responsibleEmail || !requesterName || !date || !timeSlot || !room || !bookingId) {
      return res.status(400).json({
        ok: false,
        message: 'required fields: responsibleEmail, requesterName, date, timeSlot, room, bookingId',
      });
    }

    const appBaseUrl = baseUrl || `http://localhost:${port}`;
    const confirmToken = getConfirmToken();
    const approveLink = `${appBaseUrl}/api/booking-decision-link?bookingId=${encodeURIComponent(bookingId)}&token=${encodeURIComponent(confirmToken)}&decision=approved`;
    const rejectLink = `${appBaseUrl}/api/booking-decision-link?bookingId=${encodeURIComponent(bookingId)}&token=${encodeURIComponent(confirmToken)}&decision=rejected`;

    const subject = `Room Booking Approval Request: ${room} | ${date}`;
    const text = [
      `Dear ${responsibleName || 'Responsible Staff'},`,
      '',
      'A new room booking request requires your approval.',
      `Requester: ${requesterName}`,
      `Member 1: ${member1 || '-'}`,
      `Member 2: ${member2 || '-'}`,
      `Purpose: ${purpose || '-'}`,
      `Date: ${date}`,
      `Time: ${timeSlot}`,
      `Room: ${room}`,
      '',
      `Approve: ${approveLink}`,
      `Reject: ${rejectLink}`,
    ].join('\n');

    const html = `
      <div style="font-family:Arial,sans-serif;line-height:1.6">
        <h3>Room Booking Approval Request</h3>
        <p>Dear ${responsibleName || 'Responsible Staff'},</p>
        <p>A new room booking request requires your approval.</p>
        <ul>
          <li>Requester: ${requesterName}</li>
          <li>Member 1: ${member1 || '-'}</li>
          <li>Member 2: ${member2 || '-'}</li>
          <li>Purpose: ${purpose || '-'}</li>
          <li>Date: ${date}</li>
          <li>Time: ${timeSlot}</li>
          <li>Room: ${room}</li>
        </ul>
        <a href="${approveLink}" style="display:inline-block;padding:10px 16px;background:#2a8f8a;color:#fff;text-decoration:none;border-radius:8px;font-weight:700;margin-right:8px">Approve Booking</a>
        <a href="${rejectLink}" style="display:inline-block;padding:10px 16px;background:#d55f5f;color:#fff;text-decoration:none;border-radius:8px;font-weight:700">Reject Booking</a>
      </div>
    `;

    const info = await sendMailUtf8({
      from: process.env.MAIL_FROM,
      to: responsibleEmail,
      subject,
      text,
      html,
    });

    await upsertPendingRequest({
      bookingId,
      confirmToken,
      requesterName,
      requesterEmail: requesterEmail || '',
      member1: member1 || '',
      member2: member2 || '',
      purpose: purpose || '',
      date,
      timeSlot,
      room,
      responsibleName: responsibleName || '',
      responsibleEmail,
      status: 'pending',
      createdAt: new Date().toISOString(),
    });

    return res.json({ ok: true, messageId: info.messageId || '' });
  } catch (error) {
    console.error('send-booking-email error:', error.message || error);
    return res.status(500).json({ ok: false, message: error.message || 'send_failed' });
  }
});
app.get('/confirm-booking.html', (req, res) => {
  const bookingId = String(req.query.bookingId || '').trim();
  if (!bookingId) {
    return res.status(400).send('<h3>Invalid bookingId</h3>');
  }
  return res.send(`<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Confirm Booking</title>
<style>body{font-family:Arial,sans-serif;padding:24px;background:#f4faf8;color:#2d3a44}button{background:#2a8f8a;color:#fff;border:0;padding:10px 16px;border-radius:8px;cursor:pointer}.card{max-width:520px;background:#fff;border:1px solid #d4e6e3;border-radius:14px;padding:16px}</style></head>
<body><div class="card"><h2>Confirm Room Booking</h2><p>Booking ID: ${bookingId}</p><button id="confirmBtn">Confirm Booking</button><p id="msg"></p></div>
<script>
const btn=document.getElementById('confirmBtn');
const msg=document.getElementById('msg');
btn.onclick=async()=>{btn.disabled=true;msg.textContent='Processing...';
const r=await fetch('/api/confirm-booking',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({bookingId:'${bookingId}'})});
const j=await r.json().catch(()=>({ok:false,message:'invalid_response'}));
if(j.ok){msg.textContent='Booking confirmed successfully.';}else{btn.disabled=false;msg.textContent='Confirm failed: '+(j.message||'error');}
};
</script></body></html>`);
});
app.get('/api/booking-decision-link', async (req, res) => {
  const bookingId = String(req.query.bookingId || '').trim();
  const token = String(req.query.token || '').trim();
  const decision = String(req.query.decision || '').trim();
  const normalized = decision === 'rejected' ? 'rejected' : 'approved';
  if (!bookingId || !token) {
    return res.status(400).send('<h3>Invalid confirm link</h3>');
  }

  const items = await readApprovals();
  const target = items.find((i) => i.bookingId === bookingId);
  if (!target) {
    return res.status(404).send('<h3>Booking not found</h3>');
  }
  if (!target.confirmToken || target.confirmToken !== token) {
    return res.status(403).send('<h3>Invalid token</h3>');
  }

  const result = await applyBookingDecision(bookingId, normalized);
  if (!result.ok) {
    return res.status(500).send(`<h3>Confirm failed: ${result.message}</h3>`);
  }

  return res.send(`<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Booking Decision</title>
<style>body{font-family:Arial,sans-serif;padding:24px;background:#f4faf8;color:#2d3a44}.card{max-width:560px;background:#fff;border:1px solid #d4e6e3;border-radius:14px;padding:16px}</style></head>
<body><div class="card"><h2>${normalized === 'approved' ? 'Booking Approved' : 'Booking Rejected'}</h2><p>${normalized === 'approved' ? 'This booking request has been approved. The requester has been notified.' : 'This booking request has been rejected. The requester has been notified.'}</p></div></body></html>`);
});
app.post('/api/confirm-booking', async (req, res) => {
  const bookingId = String(req.body?.bookingId || '').trim();
  if (!bookingId) {
    return res.status(400).json({ ok: false, message: 'bookingId required' });
  }
  const result = await applyBookingDecision(bookingId, 'approved');
  if (!result.ok) {
    return res.status(404).json(result);
  }
  return res.json(result);
});

app.post('/api/reject-booking', async (req, res) => {
  const bookingId = String(req.body?.bookingId || '').trim();
  if (!bookingId) {
    return res.status(400).json({ ok: false, message: 'bookingId required' });
  }
  const result = await applyBookingDecision(bookingId, 'rejected');
  if (!result.ok) {
    return res.status(404).json(result);
  }
  return res.json(result);
});

app.get('/api/confirmed-bookings', async (_req, res) => {
  const items = (await readApprovals()).filter((i) => i.status === 'approved' || i.status === 'rejected');
  return res.json({ ok: true, items });
});

app.post('/api/send-equipment-return-email', async (req, res) => {
  try {
    if (missing.length) {
      return res.status(500).json({ ok: false, message: `Missing env: ${missing.join(', ')}` });
    }
    const {
      responsibleEmail,
      responsibleName,
      requesterName,
      requesterEmail,
      item,
      quantity,
      date,
      timeSlot,
      bookingId,
      returnProofImage,
      baseUrl,
    } = req.body || {};
    if (!responsibleEmail || !bookingId || !item) {
      return res.status(400).json({
        ok: false,
        message: 'required fields: responsibleEmail, bookingId, item',
      });
    }

    const appBaseUrl = baseUrl || `http://localhost:${port}`;
    const confirmToken = getConfirmToken();
    const confirmLink = `${appBaseUrl}/api/equipment-return-link?bookingId=${encodeURIComponent(bookingId)}&token=${encodeURIComponent(confirmToken)}`;

    const subject = `Equipment Return Request: ${item}`;
    const text = [
      `Dear ${responsibleName || 'Responsible Staff'},`,
      '',
      'A return request has been submitted.',
      `Requester: ${requesterName || '-'}`,
      `Item: ${item || '-'}`,
      `Quantity: ${quantity || '-'}`,
      `Date: ${date || '-'}`,
      `Time: ${timeSlot || '-'}`,
      '',
      `Confirm return: ${confirmLink}`,
    ].join('\n');

    const html = `
      <div style="font-family:Arial,sans-serif;line-height:1.6">
        <h3>Equipment Return Request</h3>
        <p>Dear ${responsibleName || 'Responsible Staff'},</p>
        <p>A return request has been submitted.</p>
        <ul>
          <li>Requester: ${requesterName || '-'}</li>
          <li>Item: ${item || '-'}</li>
          <li>Quantity: ${quantity || '-'}</li>
          <li>Date: ${date || '-'}</li>
          <li>Time: ${timeSlot || '-'}</li>
        </ul>
        <a href="${confirmLink}" style="display:inline-block;padding:10px 16px;background:#2a8f8a;color:#fff;text-decoration:none;border-radius:8px;font-weight:700">Confirm Return</a>
      </div>
    `;

    const proofAttachment = attachmentFromDataUrl(returnProofImage, `return-proof-${bookingId}.jpg`);
    const info = await sendMailUtf8({
      from: process.env.MAIL_FROM,
      to: responsibleEmail,
      subject,
      text,
      html,
      attachments: proofAttachment ? [proofAttachment] : [],
    });

    await upsertEquipmentReturnRequest({
      bookingId,
      confirmToken,
      requesterName: requesterName || '',
      requesterEmail: requesterEmail || '',
      item: item || '',
      quantity: quantity || '',
      date: date || '',
      timeSlot: timeSlot || '',
      responsibleName: responsibleName || '',
      responsibleEmail,
      returnProofImage: returnProofImage || '',
      status: 'return_requested',
      createdAt: new Date().toISOString(),
    });

    return res.json({ ok: true, messageId: info.messageId || '' });
  } catch (error) {
    console.error('send-equipment-return-email error:', error.message || error);
    return res.status(500).json({ ok: false, message: error.message || 'send_failed' });
  }
});

app.post('/api/send-equipment-return-batch-email', async (req, res) => {
  try {
    if (missing.length) {
      return res.status(500).json({ ok: false, message: `Missing env: ${missing.join(', ')}` });
    }
    const {
      responsibleEmail,
      responsibleName,
      requesterName,
      requesterEmail,
      bookings,
      returnProofImage,
      baseUrl,
    } = req.body || {};

    const rows = Array.isArray(bookings) ? bookings : [];
    if (!responsibleEmail || !rows.length) {
      return res.status(400).json({ ok: false, message: 'required fields: responsibleEmail, bookings[]' });
    }

    const sanitized = rows
      .map((b) => ({
        bookingId: String(b?.bookingId || '').trim(),
        item: String(b?.item || '').trim(),
        quantity: String(b?.quantity || '').trim(),
        date: String(b?.date || '').trim(),
        timeSlot: String(b?.timeSlot || '').trim(),
      }))
      .filter((b) => b.bookingId && b.item);
    if (!sanitized.length) {
      return res.status(400).json({ ok: false, message: 'bookings_invalid' });
    }

    const appBaseUrl = baseUrl || `http://localhost:${port}`;
    const confirmToken = getConfirmToken();
    const idsParam = sanitized.map((b) => b.bookingId).join(',');
    const confirmLink = `${appBaseUrl}/api/equipment-return-batch-link?bookingIds=${encodeURIComponent(idsParam)}&token=${encodeURIComponent(confirmToken)}`;

    const itemRows = sanitized
      .map((b) => `- ${b.item} x ${b.quantity || '-'} (${b.date || '-'} ${b.timeSlot || '-'})`)
      .join('\n');

    const subject = `Equipment Return Request (${sanitized.length} items)`;
    const text = [
      `Dear ${responsibleName || 'Responsible Staff'},`,
      '',
      'A batch return request has been submitted.',
      `Requester: ${requesterName || '-'}`,
      '',
      itemRows,
      '',
      `Confirm return: ${confirmLink}`,
    ].join('\n');

    const html = `
      <div style="font-family:Arial,sans-serif;line-height:1.6">
        <h3>Equipment Return Request (${sanitized.length} items)</h3>
        <p>Dear ${responsibleName || 'Responsible Staff'},</p>
        <p>A batch return request has been submitted.</p>
        <p><strong>Requester:</strong> ${requesterName || '-'}</p>
        <pre style="white-space:pre-wrap">${itemRows}</pre>
        <a href="${confirmLink}" style="display:inline-block;padding:10px 16px;background:#2a8f8a;color:#fff;text-decoration:none;border-radius:8px;font-weight:700">Confirm Return</a>
      </div>
    `;

    const proofAttachment = attachmentFromDataUrl(returnProofImage, `return-proof-batch-${Date.now()}.jpg`);
    const info = await sendMailUtf8({
      from: process.env.MAIL_FROM,
      to: responsibleEmail,
      subject,
      text,
      html,
      attachments: proofAttachment ? [proofAttachment] : [],
    });

    for (const b of sanitized) {
      await upsertEquipmentReturnRequest({
        bookingId: b.bookingId,
        confirmToken,
        requesterName: requesterName || '',
        requesterEmail: requesterEmail || '',
        item: b.item || '',
        quantity: b.quantity || '',
        date: b.date || '',
        timeSlot: b.timeSlot || '',
        responsibleName: responsibleName || '',
        responsibleEmail,
        returnProofImage: returnProofImage || '',
        status: 'return_requested',
        createdAt: new Date().toISOString(),
      });
    }

    return res.json({ ok: true, messageId: info.messageId || '' });
  } catch (error) {
    console.error('send-equipment-return-batch-email error:', error.message || error);
    return res.status(500).json({ ok: false, message: error.message || 'send_failed' });
  }
});
app.get('/api/equipment-return-link', async (req, res) => {
  const bookingId = String(req.query.bookingId || '').trim();
  const token = String(req.query.token || '').trim();
  if (!bookingId || !token) {
    return res.status(400).send('<h3>Invalid return confirmation link</h3>');
  }
  const items = await readEquipmentReturns();
  const target = items.find((i) => i.bookingId === bookingId);
  if (!target) return res.status(404).send('<h3>Return request not found</h3>');
  if (!target.confirmToken || target.confirmToken !== token) {
    return res.status(403).send('<h3>Invalid token</h3>');
  }

  const result = await confirmEquipmentReturn(bookingId);
  if (!result.ok) {
    return res.status(500).send(`<h3>Confirm failed: ${result.message}</h3>`);
  }
  return res.send(`<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Equipment Return Confirmed</title>
<style>body{font-family:Arial,sans-serif;padding:24px;background:#f4faf8;color:#2d3a44}.card{max-width:560px;background:#fff;border:1px solid #d4e6e3;border-radius:14px;padding:16px}</style></head>
<body><div class="card"><h2>Equipment Return Confirmed</h2><p>The return has been confirmed and the requester has been notified.</p></div></body></html>`);
});
app.get('/api/equipment-return-batch-link', async (req, res) => {
  const token = String(req.query.token || '').trim();
  const bookingIds = String(req.query.bookingIds || '')
    .split(',')
    .map((v) => String(v || '').trim())
    .filter(Boolean);
  if (!token || !bookingIds.length) {
    return res.status(400).send('<h3>Invalid return confirmation link</h3>');
  }
  const items = await readEquipmentReturns();
  const selected = items.filter((i) => bookingIds.includes(String(i.bookingId || '')));
  if (selected.length !== bookingIds.length) {
    return res.status(404).send('<h3>Some return requests not found</h3>');
  }
  const invalid = selected.some((s) => !s.confirmToken || s.confirmToken !== token);
  if (invalid) {
    return res.status(403).send('<h3>Invalid token</h3>');
  }

  const result = await confirmEquipmentReturnBatch(bookingIds);
  if (!result.ok) {
    return res.status(500).send(`<h3>Confirm failed: ${result.message}</h3>`);
  }
  return res.send(`<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Equipment Return Confirmed</title>
<style>body{font-family:Arial,sans-serif;padding:24px;background:#f4faf8;color:#2d3a44}.card{max-width:560px;background:#fff;border:1px solid #d4e6e3;border-radius:14px;padding:16px}</style></head>
<body><div class="card"><h2>Batch Return Confirmed</h2><p>All selected returns are confirmed and the requester has been notified.</p></div></body></html>`);
});
app.get('/api/confirmed-equipment-returns', async (_req, res) => {
  const items = (await readEquipmentReturns()).filter((i) => i.status === 'returned');
  return res.json({ ok: true, items });
});

app.post('/api/validate-register-email', async (req, res) => {
  try {
    const email = String(req.body?.email || '').trim();
    if (!email) {
      return res.status(400).json({ ok: false, reason: 'required' });
    }
    const result = await validateRegisterEmail(email);
    if (!result.ok) {
      return res.status(400).json(result);
    }
    return res.json({ ok: true, email: result.email, domain: result.domain });
  } catch (error) {
    return res.status(500).json({ ok: false, reason: 'server_error', message: error.message || 'server_error' });
  }
});

app.get('/api/shared-state', async (_req, res) => {
  const items = await readSharedState();
  return res.json({ ok: true, items });
});

app.post('/api/shared-state', async (req, res) => {
  const payload = req.body && typeof req.body === 'object' ? req.body : {};
  const incoming = payload.items && typeof payload.items === 'object' ? payload.items : null;
  if (!incoming) {
    return res.status(400).json({ ok: false, message: 'invalid_payload' });
  }
  const current = await readSharedState();
  for (const [key, value] of Object.entries(incoming)) {
    if (!sharedStateKeys.has(key)) continue;
    current[key] = value;
  }
  await writeSharedState(current);
  return res.json({ ok: true });
});

app.post('/api/send-broadcast-email', async (req, res) => {
  try {
    if (missing.length) {
      return res.status(500).json({ ok: false, message: `Missing env: ${missing.join(', ')}` });
    }
    const toRaw = Array.isArray(req.body?.to) ? req.body.to : [];
    const subject = String(req.body?.subject || '').trim();
    const message = String(req.body?.message || '').trim();
    const to = [...new Set(toRaw.map((v) => String(v || '').trim().toLowerCase()).filter(Boolean))];
    if (!to.length || !subject || !message) {
      return res.status(400).json({ ok: false, message: 'required fields: to[], subject, message' });
    }

    const mailOptions = {
      from: process.env.MAIL_FROM,
      subject,
      text: message,
      html: `<div style="font-family:Arial,sans-serif;white-space:pre-line;line-height:1.6">${message}</div>`,
    };

    if (to.length === 1) {
      mailOptions.to = to[0];
    } else {
      mailOptions.to = process.env.MAIL_FROM;
      mailOptions.bcc = to.join(',');
    }

    const info = await sendMailUtf8(mailOptions);
    return res.json({ ok: true, sent: to.length, messageId: info.messageId || '' });
  } catch (error) {
    console.error('send-broadcast-email error:', error.message || error);
    return res.status(500).json({ ok: false, message: error.message || 'send_failed' });
  }
});

app.post('/api/send-register-otp', async (req, res) => {
  try {
    if (missing.length) {
      return res.status(500).json({ ok: false, message: `Missing env: ${missing.join(', ')}` });
    }
    const email = String(req.body?.email || '').trim().toLowerCase();
    const code = String(req.body?.code || '').trim();
    const name = String(req.body?.name || '').trim() || 'User';
    if (!email || !/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(email)) {
      return res.status(400).json({ ok: false, message: 'invalid_email' });
    }
    if (!/^\d{6}$/.test(code)) {
      return res.status(400).json({ ok: false, message: 'invalid_code' });
    }

    const subject = 'รหัสยืนยันสมาชิก UNDERGROUND LAB F11';
    const text = `เรียน ${name}\n\nรหัสยืนยัน (OTP) ของคุณคือ: ${code}\nรหัสนี้มีอายุการใช้งาน 10 นาที\n\nหากคุณไม่ได้ทำรายการสมัครสมาชิก กรุณาเพิกเฉยอีเมลนี้`;
    const html = `
      <div style="font-family:Arial,sans-serif;line-height:1.65;color:#243542">
        <h2 style="margin:0 0 8px">ยืนยันการสมัครสมาชิก</h2>
        <p>เรียน ${name}</p>
        <p>รหัสยืนยัน (OTP) ของคุณคือ</p>
        <div style="display:inline-block;font-size:28px;font-weight:700;letter-spacing:4px;padding:10px 14px;background:#eef9f4;border:1px solid #b8ded1;border-radius:10px;color:#2e6f5a">${code}</div>
        <p style="margin-top:12px">รหัสนี้มีอายุการใช้งาน 10 นาที</p>
        <p style="color:#5f6f79">หากคุณไม่ได้ทำรายการสมัครสมาชิก กรุณาเพิกเฉยอีเมลนี้</p>
      </div>
    `;

    const info = await sendMailUtf8({
      from: process.env.MAIL_FROM,
      to: email,
      subject,
      text,
      html,
    });
    return res.json({ ok: true, messageId: info.messageId || '' });
  } catch (error) {
    console.error('send-register-otp error:', error.message || error);
    return res.status(500).json({ ok: false, message: error.message || 'send_failed' });
  }
});

app.get('/health', (_req, res) => {
  res.json({ ok: true, dbEnabled, dbConnected: Boolean(getDbPool()) });
});

app.get('/api/mail-status', (_req, res) => {
  const configured = missing.length === 0;
  return res.json({
    ok: true,
    configured,
    missing,
    host: process.env.SMTP_HOST || '',
    port: Number(process.env.SMTP_PORT || 0),
    userHint: process.env.SMTP_USER ? `${String(process.env.SMTP_USER).slice(0, 3)}***` : '',
    from: process.env.MAIL_FROM || '',
  });
});

const dev = process.env.NODE_ENV !== 'production';
if (!fs.existsSync(nextWorkDir)) fs.mkdirSync(nextWorkDir, { recursive: true });
ensureDir(uploadsDir);

const startServer = async () => {
  if (dbEnabled) {
    try {
      await initDbWithRetry();
      await migrateFileDataToDbIfNeeded();
      console.log('MySQL connected.');
    } catch (err) {
      dbPool = null;
      if (requireDb) {
        throw new Error(`MySQL init failed and REQUIRE_DB=true: ${err.message || err}`);
      }
      console.error('MySQL init failed, fallback to file storage:', err.message || err);
    }
  } else {
    if (requireDb) {
      throw new Error('MySQL is required in this environment, but DB_HOST/DB_USER/DB_NAME are not set.');
    }
    console.log('MySQL disabled (DB_HOST/DB_USER/DB_NAME not set), using file storage.');
  }

  const originalCwd = process.cwd();
  process.chdir(nextWorkDir);
  const nextApp = next({
    dev,
    dir: __dirname,
    conf: {
      distDir: '.next',
    },
  });
  const nextHandle = nextApp.getRequestHandler();
  console.log('Preparing Next.js...');
  await nextApp.prepare();
  console.log('Next.js ready.');
  process.chdir(originalCwd);

  app.use('/legacy', express.static(path.join(__dirname)));
  app.use('/assets', express.static(path.join(__dirname, 'assets'), {
    etag: false,
    lastModified: false,
    setHeaders: (res) => {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.setHeader('Surrogate-Control', 'no-store');
    },
  }));
  app.use('/image', express.static(path.join(__dirname, 'image')));
  app.use('/uploads', express.static(uploadsDir, {
    etag: false,
    lastModified: true,
    setHeaders: (res) => {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    },
  }));

  app.get('/*.html', (req, res) => {
    const file = String(req.path || '').replace(/^\//, '').toLowerCase();
    const routeMap = {
      'index.html': '/',
      'rooms.html': '/rooms',
      'equipment.html': '/equipment',
      'login.html': '/login',
      'register.html': '/register',
      'verify.html': '/verify',
      'profile.html': '/profile',
      'admin.html': '/admin',
    };
    const nextRoute = routeMap[file];
    if (nextRoute) return res.redirect(302, nextRoute);
    return res.redirect(302, `/legacy/${file}`);
  });

  app.all('*', (req, res) => nextHandle(req, res));

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    if (missing.length) {
      console.warn(`Missing env: ${missing.join(', ')}`);
      return;
    }
    transporter.verify((err) => {
      if (err) {
        console.error(`SMTP verify failed: ${err.message}`);
        return;
      }
      console.log('SMTP verify OK');
    });
  });
};

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});





