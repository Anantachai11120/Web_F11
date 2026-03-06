const originalTextNodes = new WeakMap();

const byId = (id) => document.getElementById(id);

const pageAliasMap = {
  "": "index.html",
  "/": "index.html",
  index: "index.html",
  "index.html": "index.html",
  rooms: "rooms.html",
  "rooms.html": "rooms.html",
  equipment: "equipment.html",
  "equipment.html": "equipment.html",
  login: "login.html",
  "login.html": "login.html",
  register: "register.html",
  "register.html": "register.html",
  verify: "verify.html",
  "verify.html": "verify.html",
  profile: "profile.html",
  "profile.html": "profile.html",
  admin: "admin.html",
  "admin.html": "admin.html",
};

const getCurrentPage = () => {
  const raw = (location.pathname.split("/").pop() || "").toLowerCase();
  return pageAliasMap[raw] || raw || "index.html";
};

const isCurrentPage = (pageName) => getCurrentPage() === pageName;

const defaultHomeInfo = {
  orgName: "ชมรมกีฬา มหาวิทยาลัยเทคโนโลยีสุรนารี",
  address: "มหาวิทยาลัยเทคโนโลยีสุรนารี 111 ถ.มหาวิทยาลัย ต.สุรนารี อ.เมืองนครราชสีมา 30000",
  contactFacebook: "ชมรมกีฬา มทส.",
  contactInstagram: "SUATHCTGI",
  contactPhone: "08 2571 3564",
  units: ["ชมรมกีฬา มทส.", "สนามกีฬา", "สนามสุรพลกีฬาสถาน"],
  visitorsTotal: 246,
  visitorsToday: 17,
  visitorsDate: new Date().toISOString().slice(0, 10),
  mapUrl:
    "https://www.google.com/maps?q=Suranaree%20University%20of%20Technology&output=embed",
  managerName: "Wave Anantachai",
  managerRole: "นักกีฬา มทส.",
  managerImage: "image/IconLab.png",
  managerVisible: true,
};

const defaultResponsibleStaff = [
  {
    id: "staff-1",
    name: "อ.ผู้ดูแล Lab-F11",
    email: "labf11@univ.ac.th",
    image: "image/IconLab.png",
  },
  {
    id: "staff-2",
    name: "เจ้าหน้าที่ห้องปฏิบัติการ",
    email: "labstaff@univ.ac.th",
    image: "image/IconLab.png",
  },
];

const defaultEquipmentItems = [
  { id: "eq-1", name: "Microscope", image: "image/IconLab.png", stock: 3, type: "งานวิทยาศาสตร์" },
  { id: "eq-2", name: "Oscilloscope", image: "image/IconLab.png", stock: 3, type: "งานไฟฟ้า" },
  { id: "eq-3", name: "3D Printer", image: "image/IconLab.png", stock: 2, type: "งานเครื่องกล" },
  { id: "eq-4", name: "Sensor Kit", image: "image/IconLab.png", stock: 5, type: "งานไฟฟ้า" },
];

const defaultEquipmentTypes = ["งานวิทยาศาสตร์", "งานไฟฟ้า", "งานไม้", "งานเครื่องกล"];

const sharedStorageKeys = new Set([
  storageKeys.users,
  storageKeys.roomBookings,
  storageKeys.equipmentBookings,
  storageKeys.equipmentItems,
  storageKeys.equipmentTypes,
  storageKeys.announcements,
  storageKeys.homeInfo,
  storageKeys.responsibleStaff,
  storageKeys.notifications,
]);

const sharedSyncState = {
  ready: false,
  queue: {},
  timer: null,
};

const pushSharedStateToServer = async () => {
  const items = { ...sharedSyncState.queue };
  sharedSyncState.queue = {};
  sharedSyncState.timer = null;
  if (!Object.keys(items).length) return;
  try {
    await fetch("/api/shared-state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
  } catch {
    // Keep local data if network/server temporarily unavailable.
  }
};

const queueSharedSync = (key, value) => {
  if (!sharedStorageKeys.has(key)) return;
  sharedSyncState.queue[key] = value;
  if (sharedSyncState.timer) return;
  sharedSyncState.timer = setTimeout(pushSharedStateToServer, 350);
};

const initSharedStorage = async () => {
  if (sharedSyncState.ready) return;
  try {
    const res = await fetch("/api/shared-state", { cache: "no-store" });
    if (res.ok) {
      const body = await res.json().catch(() => ({}));
      const items = body && typeof body.items === "object" ? body.items : {};
      sharedStorageKeys.forEach((key) => {
        const hasServerValue = Object.prototype.hasOwnProperty.call(items, key);
        if (hasServerValue) {
          localStorage.setItem(key, JSON.stringify(items[key]));
          return;
        }
        try {
          const rawLocal = localStorage.getItem(key);
          if (!rawLocal) return;
          const parsed = JSON.parse(rawLocal);
          queueSharedSync(key, parsed);
        } catch {
          // skip invalid local JSON
        }
      });
    }
  } catch {
    // Use localStorage fallback when shared API is unavailable.
  } finally {
    sharedSyncState.ready = true;
  }
};

const load = (key, fallback = []) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const save = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
  queueSharedSync(key, value);
};

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("read_failed"));
    reader.readAsDataURL(file);
  });

const getLang = () => {
  const lang = localStorage.getItem(storageKeys.lang);
  return lang === "en" ? "en" : "th";
};

const t = (key, vars = {}) => {
  const lang = getLang();
  const dict = i18n[lang] || i18n.th;
  let out = dict[key] || i18n.en[key] || i18n.th[key] || key;
  Object.keys(vars).forEach((k) => {
    out = out.replaceAll(`{{${k}}}`, String(vars[k]));
  });
  return out;
};

const localeByLang = () => {
  return getLang() === "th" ? "th-TH" : "en-US";
};

const setNotice = (el, message, type = "ok") => {
  if (!el) return;
  el.hidden = false;
  el.className = `notice ${type}`;
  el.textContent = message;
};

const cropState = {
  image: null,
  zoom: 1,
  offsetX: 0,
  offsetY: 0,
  croppedDataUrl: "",
};

const getCropFrame = (canvas) => {
  const frameW = canvas.width * 0.74;
  const frameH = frameW * (9 / 16);
  const x = (canvas.width - frameW) / 2;
  const y = (canvas.height - frameH) / 2;
  return { x, y, w: frameW, h: frameH };
};

const drawCropCanvas = () => {
  const canvas = byId("cropCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#f7fbfc";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (!cropState.image) {
    ctx.fillStyle = "#8a97a5";
    ctx.font = "14px Nunito";
    ctx.fillText("No Image", 12, 24);
    return;
  }

  const img = cropState.image;
  const baseScale = Math.max(canvas.width / img.width, canvas.height / img.height);
  const drawScale = baseScale * cropState.zoom;
  const drawW = img.width * drawScale;
  const drawH = img.height * drawScale;
  const dx = (canvas.width - drawW) / 2 + cropState.offsetX;
  const dy = (canvas.height - drawH) / 2 + cropState.offsetY;
  ctx.drawImage(img, dx, dy, drawW, drawH);

  const frame = getCropFrame(canvas);
  ctx.fillStyle = "rgba(0,0,0,0.28)";
  ctx.beginPath();
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.rect(frame.x, frame.y, frame.w, frame.h);
  ctx.fill("evenodd");
  ctx.strokeStyle = "#ff8f2b";
  ctx.lineWidth = 2;
  ctx.strokeRect(frame.x, frame.y, frame.w, frame.h);
};

const createCroppedDataUrl = () => {
  const canvas = byId("cropCanvas");
  if (!canvas || !cropState.image) return "";
  const frame = getCropFrame(canvas);
  const img = cropState.image;

  const baseScale = Math.max(canvas.width / img.width, canvas.height / img.height);
  const drawScale = baseScale * cropState.zoom;
  const drawW = img.width * drawScale;
  const drawH = img.height * drawScale;
  const dx = (canvas.width - drawW) / 2 + cropState.offsetX;
  const dy = (canvas.height - drawH) / 2 + cropState.offsetY;

  let sx = (frame.x - dx) / drawScale;
  let sy = (frame.y - dy) / drawScale;
  let sw = frame.w / drawScale;
  let sh = frame.h / drawScale;

  sx = Math.max(0, sx);
  sy = Math.max(0, sy);
  if (sx + sw > img.width) sw = img.width - sx;
  if (sy + sh > img.height) sh = img.height - sy;
  if (sw <= 0 || sh <= 0) return "";

  const out = document.createElement("canvas");
  out.width = 800;
  out.height = 450;
  const outCtx = out.getContext("2d");
  if (!outCtx) return "";
  outCtx.drawImage(img, sx, sy, sw, sh, 0, 0, out.width, out.height);
  return out.toDataURL("image/jpeg", 0.9);
};

const setupCropTool = () => {
  const fileInput = byId("announceImage");
  const zoom = byId("cropZoom");
  const x = byId("cropX");
  const y = byId("cropY");
  const applyBtn = byId("applyCropBtn");
  const status = byId("cropStatus");
  if (!fileInput || !zoom || !x || !y || !applyBtn || !status) return;

  const setStatus = (key) => {
    status.textContent = t(key);
  };

  const updateFromSliders = () => {
    cropState.zoom = Number(zoom.value);
    cropState.offsetX = Number(x.value);
    cropState.offsetY = Number(y.value);
    drawCropCanvas();
  };

  fileInput.addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    cropState.croppedDataUrl = "";
    if (!file) {
      cropState.image = null;
      drawCropCanvas();
      setStatus("cropEmpty");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        cropState.image = img;
        cropState.zoom = 1;
        cropState.offsetX = 0;
        cropState.offsetY = 0;
        zoom.value = "1";
        x.value = "0";
        y.value = "0";
        drawCropCanvas();
        setStatus("cropPending");
      };
      img.src = String(reader.result || "");
    };
    reader.readAsDataURL(file);
  });

  zoom.addEventListener("input", updateFromSliders);
  x.addEventListener("input", updateFromSliders);
  y.addEventListener("input", updateFromSliders);

  applyBtn.addEventListener("click", () => {
    cropState.croppedDataUrl = createCroppedDataUrl();
    if (cropState.croppedDataUrl) {
      setStatus("cropReady");
    } else {
      setStatus("imageRequired");
    }
  });

  drawCropCanvas();
  setStatus("cropEmpty");
};

const refreshCropStatusByState = () => {
  const status = byId("cropStatus");
  if (!status) return;
  if (cropState.croppedDataUrl) {
    status.textContent = t("cropReady");
    return;
  }
  if (cropState.image) {
    status.textContent = t("cropPending");
    return;
  }
  status.textContent = t("cropEmpty");
};

const applyTranslations = () => {
  const lang = getLang();
  document.documentElement.lang = lang;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (!key) return;
    el.textContent = t(key);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (!key) return;
    el.setAttribute("placeholder", t(key));
  });

  document.querySelectorAll("[data-i18n-value]").forEach((el) => {
    const key = el.getAttribute("data-i18n-value");
    if (!key) return;
    if ("value" in el) el.value = t(key);
    else el.setAttribute("value", t(key));
  });

  const titleMap = {
    "index.html": { th: "LabFlow | หน้าหลัก", en: "LabFlow | Home", zh: "LabFlow | 主页", es: "LabFlow | Inicio" },
    "rooms.html": { th: "LabFlow | จองห้อง", en: "LabFlow | Room Booking", zh: "LabFlow | 房间预约", es: "LabFlow | Reserva de sala" },
    "equipment.html": { th: "LabFlow | จองอุปกรณ์", en: "LabFlow | Equipment Booking", zh: "LabFlow | 设备预约", es: "LabFlow | Reserva de equipo" },
    "register.html": { th: "LabFlow | สมัครสมาชิก", en: "LabFlow | Register", zh: "LabFlow | 注册", es: "LabFlow | Registro" },
    "verify.html": { th: "LabFlow | ยืนยันบัญชี", en: "LabFlow | Verify", zh: "LabFlow | 验证", es: "LabFlow | Verificar" },
    "login.html": { th: "LabFlow | เข้าสู่ระบบ", en: "LabFlow | Login", zh: "LabFlow | 登录", es: "LabFlow | Iniciar sesión" },
    "admin.html": { th: "LabFlow | แอดมิน", en: "LabFlow | Admin", zh: "LabFlow | 管理员", es: "LabFlow | Admin" },
    "profile.html": { th: "LabFlow | โปรไฟล์", en: "LabFlow | Profile", zh: "LabFlow | 个人资料", es: "LabFlow | Perfil" },
  };
  const page = getCurrentPage();
  if (titleMap[page]) {
    document.title = titleMap[page][lang];
  }

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    const parent = node.parentElement;
    const raw = node.nodeValue || "";
    const trimmed = raw.trim();
    if (
      parent &&
      trimmed &&
      !parent.closest("[data-i18n]") &&
      !parent.closest("script") &&
      !parent.closest("style")
    ) {
      const source = originalTextNodes.get(node) || trimmed;
      if (!originalTextNodes.has(node)) originalTextNodes.set(node, source);
      if (lang === "th") {
        node.nodeValue = raw.replace(trimmed, source);
      } else {
        const map = staticLocalized[lang] || staticLocalized.en;
        const translated = map[source] || staticLocalized.en[source] || source;
        node.nodeValue = raw.replace(trimmed, translated);
      }
    }
    node = walker.nextNode();
  }

  document.querySelectorAll("input[placeholder], textarea[placeholder]").forEach((el) => {
    if (el.hasAttribute("data-i18n-placeholder")) return;
    const placeholder = el.getAttribute("placeholder") || "";
    if (!placeholder) return;
    if (!el.dataset.thPlaceholder) el.dataset.thPlaceholder = placeholder;
    if (lang === "th") {
      el.setAttribute("placeholder", el.dataset.thPlaceholder);
      return;
    }
    const map = staticLocalized[lang] || staticLocalized.en;
    if (map[el.dataset.thPlaceholder]) {
      el.setAttribute("placeholder", map[el.dataset.thPlaceholder]);
      return;
    }
    if (lang !== "en" && staticLocalized.en[el.dataset.thPlaceholder]) {
      el.setAttribute("placeholder", staticLocalized.en[el.dataset.thPlaceholder]);
    }
  });
};

const setupLanguageSelector = () => {
  const selects = document.querySelectorAll("#languageSelect");
  if (!selects.length) return;
  selects.forEach((sel) => {
    sel.value = getLang();
    sel.addEventListener("change", (e) => {
      const nextLang = e.target.value === "en" ? "en" : "th";
      localStorage.setItem(storageKeys.lang, nextLang);
      applyTranslations();
      renderDashboard();
      renderAnnouncements();
      renderRoomApproval();
      renderAdminUsers();
      renderAdminUserProfilePanel();
      renderAdminEquipmentBorrowSummary();
      renderBroadcastRecipientList();
      renderAdminAnnouncements();
      renderEquipmentTypeFilterOptions();
      refreshEquipmentFilterLabels();
      refreshSessionLabel();
      ensureAdminAccess();
      refreshCropStatusByState();
      updateBookingAuthUI();
      updateNavAuthState();
      setupAuthNav();
    });
  });
};

const activeNav = () => {
  const path = getCurrentPage();
  document.querySelectorAll(".nav a").forEach((a) => {
    if (a.getAttribute("href") === path) a.classList.add("active");
  });
};

const performLogout = ({ redirect = true } = {}) => {
  localStorage.removeItem(storageKeys.session);
  setupAdminNav();
  setupAuthNav();
  refreshSessionLabel();
  lockAdminUiImmediately();
  ensureAdminAccess();
  updateBookingAuthUI();
  updateNavAuthState();
  renderAnnouncements();
  if (redirect) {
    const page = location.pathname.split("/").pop() || "index.html";
    if (page !== "login.html") {
      location.href = "login.html";
    }
  }
};

const updateNavAuthState = () => {
  const user = getCurrentUser();
  const authLinks = Array.from(document.querySelectorAll('.nav a[data-i18n="navLogin"]'));
  authLinks.forEach((link) => {
    if (!(link instanceof HTMLAnchorElement)) return;
    link.textContent = user ? t("navLogout") : t("navLogin");
    link.classList.toggle("logout-pill", Boolean(user));
    const nav = link.closest(".nav");
    const profileLink = nav?.querySelector('a[href="profile.html"]');
    if (user && nav && profileLink instanceof HTMLElement) {
      nav.insertBefore(profileLink, link);
    }
    if (!link.dataset.logoutBound) {
      link.dataset.logoutBound = "1";
      link.addEventListener("click", (e) => {
        if (!getCurrentUser()) return;
        e.preventDefault();
        performLogout({ redirect: true });
      });
    }
  });
};

const setFooterYear = () => {
  const yearNode = byId("year");
  if (yearNode) yearNode.textContent = String(new Date().getFullYear());
};

const syncRootAuthState = () => {
  const root = document.documentElement;
  const user = getCurrentUser();
  if (!root) return;
  if (!user) {
    root.dataset.auth = "out";
    root.dataset.role = "guest";
    return;
  }
  root.dataset.auth = "in";
  root.dataset.role = user.role === "admin" ? "admin" : "user";
};

const getSession = () => load(storageKeys.session, null);

const getUsers = () => load(storageKeys.users);

const getRoomQuota = (user) => {
  const daily = Math.max(1, Number(user?.roomQuotaDaily || 1));
  const weekly = Math.max(1, Number(user?.roomQuotaWeekly || 3));
  return { daily, weekly };
};

const getCurrentUser = () => {
  const session = getSession();
  if (!session) return null;
  const users = getUsers();
  return users.find((u) => u.username === session.username) || null;
};

const roleLabel = (role) => (role === "admin" ? t("roleAdmin") : t("roleUser"));
const statusLabel = (status) =>
  status === "approved"
    ? t("statusApproved")
    : status === "rejected"
      ? t("statusRejected")
      : t("statusPending");
const statusClass = (status) =>
  status === "approved" ? "approved" : status === "rejected" ? "rejected" : "pending";

const toBookingStartTimestamp = (booking) => {
  const startAt = parseBookingStartAt(booking);
  return startAt ? startAt.getTime() : 0;
};

const sortRoomBookingsByUsageDesc = (list = []) =>
  [...list].sort((a, b) => {
    const diff = toBookingStartTimestamp(b) - toBookingStartTimestamp(a);
    if (diff !== 0) return diff;
    return String(b.createdAt || "").localeCompare(String(a.createdAt || ""));
  });

const isAdminSession = () => {
  const user = getCurrentUser();
  return Boolean(user && user.role === "admin");
};

const lockAdminUiImmediately = () => {
  byId("adminPanel") && (byId("adminPanel").hidden = true);
  byId("adminGate") && (byId("adminGate").hidden = false);
  byId("equipmentAdminTools") && (byId("equipmentAdminTools").hidden = true);
  byId("labBottomAdminTools") && (byId("labBottomAdminTools").hidden = true);
};

const requireAdminAction = () => {
  if (isAdminSession()) return true;
  lockAdminUiImmediately();
  ensureAdminAccess();
  return false;
};

const setupAdminNav = () => {
  const adminLinks = document.querySelectorAll('.nav a[href="admin.html"], .admin-only');
  if (!adminLinks.length) return;
  const canShow = isAdminSession();
  adminLinks.forEach((link) => {
    link.hidden = !canShow;
  });
  syncRootAuthState();
};

const setupAuthNav = () => {
  const authLinks = document.querySelectorAll('.nav a[href="profile.html"], .auth-only');
  if (!authLinks.length) return;
  const isLoggedIn = Boolean(getCurrentUser());
  authLinks.forEach((link) => {
    link.hidden = !isLoggedIn;
  });
  syncRootAuthState();
};

const ensureAdminAccess = () => {
  const page = getCurrentPage();
  if (page === "profile.html" && !getCurrentUser()) {
    location.href = "login.html";
    return;
  }
  if (page === "verify.html" && !isAdminSession()) {
    location.href = "login.html";
    return;
  }
  if (page === "admin.html" && !isAdminSession()) {
    location.href = "login.html";
    return;
  }
  if (page !== "admin.html") return;

  const gate = byId("adminGate");
  const panel = byId("adminPanel");

  if (isAdminSession()) {
    if (gate) gate.hidden = true;
    if (panel) panel.hidden = false;
    return;
  }

  if (gate) {
    gate.hidden = false;
    const p = gate.querySelector("p");
    if (p) p.textContent = t("accessDenied");
  }
  if (panel) panel.hidden = true;
};

const setupClientHardening = () => {
  const debugEnabled = localStorage.getItem("lab_debug") === "1";
  if (!debugEnabled) {
    const noop = () => {};
    try {
      console.log = noop;
      console.info = noop;
      console.debug = noop;
    } catch {
      // ignore
    }
  }
  if (document.body?.dataset.clientHardened === "1") return;
  if (document.body) document.body.dataset.clientHardened = "1";
  document.addEventListener("contextmenu", (e) => e.preventDefault());
  document.addEventListener("keydown", (e) => {
    const key = String(e.key || "").toLowerCase();
    const block =
      key === "f12" ||
      (e.ctrlKey && e.shiftKey && ["i", "j", "c"].includes(key)) ||
      (e.ctrlKey && key === "u");
    if (block) e.preventDefault();
  });
};

const seedHomeInfo = () => {
  const exists = localStorage.getItem(storageKeys.homeInfo);
  if (exists) return;
  save(storageKeys.homeInfo, defaultHomeInfo);
};

const seedResponsibleStaff = () => {
  const exists = localStorage.getItem(storageKeys.responsibleStaff);
  if (exists) return;
  save(storageKeys.responsibleStaff, defaultResponsibleStaff);
};

const seedEquipmentItems = () => {
  const exists = localStorage.getItem(storageKeys.equipmentItems);
  if (exists) return;
  save(storageKeys.equipmentItems, defaultEquipmentItems);
};

const seedEquipmentTypes = () => {
  const exists = localStorage.getItem(storageKeys.equipmentTypes);
  if (exists) return;
  save(storageKeys.equipmentTypes, defaultEquipmentTypes);
};

const normalizeEquipmentBookingsData = () => {
  const list = load(storageKeys.equipmentBookings, []);
  if (!Array.isArray(list) || !list.length) return;
  const staff = getResponsibleStaff();
  const defaultResponsibleId = staff[0]?.id || "";
  const items = normalizeEquipmentItems();
  let changed = false;
  const normalized = list.map((b) => {
    const next = { ...b };
    if (!next.bookingId) {
      next.bookingId = `eqb-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      changed = true;
    }
    if (!next.room) {
      next.room = "Lab-F11";
      changed = true;
    }
    if (!next.returnStatus) {
      next.returnStatus = "borrowed";
      changed = true;
    }
    if (!next.responsibleId) {
      next.responsibleId = defaultResponsibleId;
      changed = true;
    }
    if (!next.itemId && next.item) {
      const hit = items.find((i) => i.name === next.item);
      if (hit) {
        next.itemId = hit.id;
        changed = true;
      }
    }
    return next;
  });
  if (changed) save(storageKeys.equipmentBookings, normalized);
};

const migrateLegacyData = () => {
  const targetVersion = 3;
  const meta = load(storageKeys.meta, { version: 0 });
  if (Number(meta.version || 0) >= targetVersion) return;

  const staff = load(storageKeys.responsibleStaff, defaultResponsibleStaff);
  const defaultResponsibleId = staff[0]?.id || "";

  const roomBookings = load(storageKeys.roomBookings, []).map((b) => {
    const requesterName = b.requesterName || b.name || "";
    const participantCount =
      Number(
        b.participantCount ||
        [requesterName, b.member1 || "", b.member2 || ""].filter(Boolean).length ||
        1
      );
    return {
      ...b,
      requesterName,
      name: requesterName,
      room: b.room || "Lab-F11",
      bookingId: b.bookingId || `bk-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      participantCount,
      responsibleId: b.responsibleId || defaultResponsibleId,
      status: b.status || "pending",
    };
  });
  save(storageKeys.roomBookings, roomBookings);

  const users = load(storageKeys.users, []).map((u) => ({
    ...u,
    studentId: u.studentId || "",
    year: u.year || "",
    school: u.school || "",
    major: u.major || "",
    phone: u.phone || "",
    profileImage: u.profileImage || "",
  }));
  save(storageKeys.users, users);

  const equipmentBookings = load(storageKeys.equipmentBookings, []).map((b) => ({
    ...b,
    bookingId: b.bookingId || `eqb-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timeSlot: b.timeSlot || "",
    room: b.room || "Lab-F11",
    responsibleId: b.responsibleId || defaultResponsibleId,
    returnStatus: b.returnStatus || "borrowed",
  }));
  save(storageKeys.equipmentBookings, equipmentBookings);

  const items = load(storageKeys.equipmentItems, []);
  if (!Array.isArray(items) || !items.length) {
    save(storageKeys.equipmentItems, defaultEquipmentItems);
  } else {
    save(
      storageKeys.equipmentItems,
      items.map((it, idx) => ({
        id: it.id || `eq-${idx + 1}`,
        name: it.name || `Item ${idx + 1}`,
        image: it.image || "image/IconLab.png",
        stock: Math.max(1, Number(it.stock || 1)),
        type: it.type || "ทั่วไป",
      }))
    );
  }

  const types = load(storageKeys.equipmentTypes, []);
  if (!Array.isArray(types) || !types.length) {
    save(storageKeys.equipmentTypes, defaultEquipmentTypes);
  } else {
    const normalizedTypes = [...new Set(types.map((v) => String(v || "").trim()).filter(Boolean))];
    if (!normalizedTypes.length) normalizedTypes.push(...defaultEquipmentTypes);
    save(storageKeys.equipmentTypes, normalizedTypes);
  }

  save(storageKeys.meta, { version: targetVersion, migratedAt: new Date().toISOString() });
};

const syncResponsibleApprovals = async () => {
  try {
    const res = await fetch('/api/confirmed-bookings');
    if (!res.ok) return;
    const body = await res.json();
    if (!Array.isArray(body.items)) return;
    const map = new Map(body.items.map((i) => [i.bookingId, i]));
    const list = load(storageKeys.roomBookings, []);
    let changed = false;
    list.forEach((b) => {
      const hit = map.get(b.bookingId);
      if (!hit) return;
      if (b.status !== hit.status) {
        b.status = hit.status;
        if (hit.status === 'approved') {
          b.approvedBy = hit.approvedBy || 'responsible';
          b.approvedAt = hit.approvedAt || new Date().toISOString();
        } else if (hit.status === 'rejected') {
          b.rejectedBy = hit.rejectedBy || 'responsible';
          b.rejectedAt = hit.rejectedAt || new Date().toISOString();
        }
        changed = true;
      }
    });
    if (changed) save(storageKeys.roomBookings, list);
  } catch {
    // API may be unavailable when static host is used.
  }
};

const updateVisitorCounters = () => {
  const page = location.pathname.split("/").pop() || "index.html";
  if (page !== "index.html") return;

  const today = new Date().toISOString().slice(0, 10);
  const marker = `lab_visit_counted_${today}`;
  const info = { ...defaultHomeInfo, ...load(storageKeys.homeInfo, defaultHomeInfo) };

  if (info.visitorsDate !== today) {
    info.visitorsDate = today;
    info.visitorsToday = 0;
  }

  if (!sessionStorage.getItem(marker)) {
    info.visitorsTotal = Number(info.visitorsTotal || 0) + 1;
    info.visitorsToday = Number(info.visitorsToday || 0) + 1;
    sessionStorage.setItem(marker, "1");
    save(storageKeys.homeInfo, info);
  }
};

const seedAdmin = () => {
  const users = load(storageKeys.users);
  const adminUsername = "Anantachai2000";
  const hasAdmin = users.some((u) => u.username === adminUsername);
  if (hasAdmin) return;

  users.push({
    name: "System Admin",
    username: adminUsername,
    email: "anantachai2000@labflow.local",
    password: "Wave_862543",
    verified: true,
    verificationCode: "000000",
    role: "admin",
    roomQuotaDaily: 1,
    roomQuotaWeekly: 3,
  });
  save(storageKeys.users, users);
};

const normalizeUsers = () => {
  const users = load(storageKeys.users);
  const normalized = users.map((u) => ({
    ...u,
    username: u.username || (u.email ? u.email.split("@")[0] : "user"),
    role: u.role || "user",
    roomQuotaDaily: Math.max(1, Number(u.roomQuotaDaily || 1)),
    roomQuotaWeekly: Math.max(1, Number(u.roomQuotaWeekly || 3)),
  }));
  save(storageKeys.users, normalized);
};
