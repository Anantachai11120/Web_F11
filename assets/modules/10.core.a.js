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
  orgName: "\u0e41\u0e25\u0e1b\u0e0a\u0e31\u0e49\u0e19\u0e43\u0e15\u0e49\u0e14\u0e34\u0e19 F11 (Underground LAB F11)",
  address:
    "\u0e21\u0e2b\u0e32\u0e27\u0e34\u0e17\u0e22\u0e32\u0e25\u0e31\u0e22\u0e40\u0e17\u0e04\u0e42\u0e19\u0e42\u0e25\u0e22\u0e35\u0e2a\u0e38\u0e23\u0e19\u0e32\u0e23\u0e35 111 \u0e16.\u0e21\u0e2b\u0e32\u0e27\u0e34\u0e17\u0e22\u0e32\u0e25\u0e31\u0e22 \u0e15.\u0e2a\u0e38\u0e23\u0e19\u0e32\u0e23\u0e35 \u0e2d.\u0e40\u0e21\u0e37\u0e2d\u0e07\u0e19\u0e04\u0e23\u0e23\u0e32\u0e0a\u0e2a\u0e35\u0e21\u0e32 30000",
  contactFacebook: "\u0e41\u0e25\u0e1b\u0e0a\u0e31\u0e49\u0e19\u0e43\u0e15\u0e49\u0e14\u0e34\u0e19 F11",
  contactInstagram: "\u0e41\u0e25\u0e1b\u0e0a\u0e31\u0e49\u0e19\u0e43\u0e15\u0e49\u0e14\u0e34\u0e19 F11",
  contactPhone: "08 2571 3564",
  units: [
    "\u0e2d\u0e32\u0e04\u0e32\u0e23\u0e2a\u0e34\u0e23\u0e34\u0e19\u0e18\u0e23\u0e27\u0e34\u0e27\u0e31\u0e12\u0e19\u0e4c (F11)",
    "\u0e21\u0e2b\u0e32\u0e27\u0e34\u0e17\u0e22\u0e32\u0e25\u0e31\u0e22\u0e40\u0e17\u0e04\u0e42\u0e19\u0e42\u0e25\u0e22\u0e35\u0e2a\u0e38\u0e23\u0e19\u0e32\u0e23\u0e35",
  ],
  visitorsTotal: 256,
  visitorsToday: 1,
  visitorsDate: new Date().toISOString().slice(0, 10),
  mapUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d610.8910247070661!2d102.01582736648943!3d14.875732966597766!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x311eada2dc228d57%3A0xfdb33a3a1db3b61!2zRjExIOC4reC4suC4hOC4suC4o-C4quC4tOC4o-C4tOC4meC4mOC4o-C4p-C4tOC4qOC4p-C4nuC4seC4kuC4meC5jCBTSVJJTkRIT1JOIFdJVFNBV0FQSEFUIEJVSUxESU5H!5e1!3m2!1sth!2sth!4v1772808962879!5m2!1sth!2sth",
  managerName: "Wave Anantachai",
  managerRole: "\u0e0a\u0e48\u0e32\u0e07\u0e01\u0e25\u0e42\u0e23\u0e07\u0e2a\u0e35",
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
  storageKeys.roomClosures,
  storageKeys.notifications,
]);

const sharedSyncState = {
  ready: false,
  hydrated: false,
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
  if (!sharedSyncState.ready) return;
  if (!sharedSyncState.hydrated) return;
  if (sharedSyncState.timer) return;
  sharedSyncState.timer = setTimeout(pushSharedStateToServer, 350);
};

const initSharedStorage = async () => {
  if (sharedSyncState.ready) return false;
  let changed = false;
  let loadedFromServer = false;
  try {
    let res = null;
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 5000);
      try {
        res = await fetch("/api/shared-state", {
          cache: "no-store",
          signal: controller.signal,
        });
        if (res.ok) break;
      } catch {
        // retry
      } finally {
        clearTimeout(timer);
      }
    }
    if (res && res.ok) {
      loadedFromServer = true;
      const body = await res.json().catch(() => ({}));
      const items = body && typeof body.items === "object" ? body.items : {};
      sharedStorageKeys.forEach((key) => {
        const hasServerValue = Object.prototype.hasOwnProperty.call(items, key);
        if (hasServerValue) {
          // Server state wins: prevent stale pre-sync local queue from overwriting it.
          delete sharedSyncState.queue[key];
          const nextRaw = JSON.stringify(items[key]);
          const prevRaw = localStorage.getItem(key);
          if (prevRaw !== nextRaw) changed = true;
          writeLocalStorageSafe(key, items[key]);
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
    sharedSyncState.hydrated = loadedFromServer;
    if (sharedSyncState.hydrated && Object.keys(sharedSyncState.queue).length) {
      if (sharedSyncState.timer) clearTimeout(sharedSyncState.timer);
      sharedSyncState.timer = setTimeout(pushSharedStateToServer, 0);
    }
  }
  return changed;
};

const load = (key, fallback = []) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const isQuotaExceededError = (error) => {
  if (!error) return false;
  const name = String(error.name || "");
  const code = Number(error.code || 0);
  return name === "QuotaExceededError" || code === 22 || code === 1014;
};

const stripLargeDataUrls = (input, maxLength = 45_000) => {
  if (typeof input === "string") {
    if (input.startsWith("data:image/") && input.length > maxLength) return "";
    return input;
  }
  if (Array.isArray(input)) return input.map((v) => stripLargeDataUrls(v, maxLength));
  if (!input || typeof input !== "object") return input;
  const out = {};
  Object.entries(input).forEach(([k, v]) => {
    out[k] = stripLargeDataUrls(v, maxLength);
  });
  return out;
};

const writeLocalStorageSafe = (key, value) => {
  const raw = JSON.stringify(value);
  try {
    localStorage.setItem(key, raw);
    return true;
  } catch (error) {
    if (!isQuotaExceededError(error)) return false;
  }

  try {
    const compactValue = stripLargeDataUrls(value);
    localStorage.setItem(key, JSON.stringify(compactValue));
    return true;
  } catch {
    return false;
  }
};

const save = (key, value) => {
  queueSharedSync(key, value);
  writeLocalStorageSafe(key, value);
};

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("read_failed"));
    reader.readAsDataURL(file);
  });

const optimizeImageFileToDataUrl = (file, maxSize = 520, quality = 0.82) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const ratio = Math.min(1, maxSize / Math.max(img.width, img.height));
        const w = Math.max(1, Math.round(img.width * ratio));
        const h = Math.max(1, Math.round(img.height * ratio));
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("canvas_failed"));
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = () => reject(new Error("image_decode_failed"));
      img.src = String(reader.result || "");
    };
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

const normalizeNavPath = (href) => {
  const raw = String(href || "").trim();
  if (!raw || raw.startsWith("#") || raw.startsWith("javascript:")) return "";
  if (/^https?:\/\//i.test(raw)) {
    try {
      const u = new URL(raw);
      return u.pathname || "/";
    } catch {
      return "";
    }
  }
  let p = raw;
  if (!p.startsWith("/")) p = `/${p}`;
  p = p.replace(/\/index\.html$/i, "/").replace(/\.html$/i, "");
  if (!p) return "/";
  return p;
};

const setupFastNavUX = () => {
  const links = Array.from(document.querySelectorAll(".nav a[href]"));
  if (!links.length) return;
  links.forEach((link) => {
    if (!(link instanceof HTMLAnchorElement)) return;
    if (link.dataset.navFastBound) return;
    link.dataset.navFastBound = "1";
    link.addEventListener("click", () => {
      const target = normalizeNavPath(link.getAttribute("href"));
      if (!target) return;
      const current = normalizeNavPath(location.pathname);
      if (target === current) return;
      document.querySelectorAll(".nav a.active").forEach((a) => a.classList.remove("active"));
      link.classList.add("active");
      link.classList.add("nav-pending");
      window.setTimeout(() => link.classList.remove("nav-pending"), 600);
    });
  });
};

const prefetchNavPages = () => {
  const pages = ["/", "/rooms", "/equipment", "/profile", "/login", "/admin"];
  const head = document.head || document.getElementsByTagName("head")[0];
  if (!head) return;
  pages.forEach((href) => {
    if (document.querySelector(`link[data-nav-prefetch="${href}"]`)) return;
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.href = href;
    link.as = "document";
    link.dataset.navPrefetch = href;
    head.appendChild(link);
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
  const isLoggedIn = isLoggedInSession();
  const authLinks = Array.from(document.querySelectorAll('.nav a[data-i18n="navLogin"]'));
  authLinks.forEach((link) => {
    if (!(link instanceof HTMLAnchorElement)) return;
    link.textContent = isLoggedIn ? t("navLogout") : t("navLogin");
    link.classList.toggle("logout-pill", isLoggedIn);
    if (!link.dataset.logoutBound) {
      link.dataset.logoutBound = "1";
      link.addEventListener("click", (e) => {
        if (!isLoggedInSession()) return;
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

const getSession = () => load(storageKeys.session, null);

const isLoggedInSession = () => {
  const session = getSession();
  return Boolean(session && session.username);
};

const getSessionRole = () => {
  const session = getSession();
  return session?.role === "admin" ? "admin" : "user";
};

const syncRootAuthState = () => {
  const root = document.documentElement;
  if (!root) return;
  if (!isLoggedInSession()) {
    root.dataset.auth = "out";
    root.dataset.role = "guest";
    return;
  }
  root.dataset.auth = "in";
  root.dataset.role = getSessionRole();
};

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
  const found = users.find((u) => u.username === session.username);
  if (found) return found;
  // Keep UI stable even when users list is not hydrated yet.
  return {
    username: session.username || "",
    email: session.email || "",
    name: session.name || session.username || "",
    role: session.role || "user",
    verified: true,
  };
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
  if (getSessionRole() === "admin") return true;
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
  const canShow = getSessionRole() === "admin" || isAdminSession();
  adminLinks.forEach((link) => {
    link.hidden = !canShow;
  });
  syncRootAuthState();
};

const setupAuthNav = () => {
  const authLinks = document.querySelectorAll('.nav a[href="profile.html"], .auth-only');
  if (!authLinks.length) return;
  const isLoggedIn = isLoggedInSession();
  authLinks.forEach((link) => {
    link.hidden = !isLoggedIn;
  });
  syncRootAuthState();
};

const ensureAdminAccess = () => {
  const page = getCurrentPage();
  if (page === "profile.html" && !isLoggedInSession()) {
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

