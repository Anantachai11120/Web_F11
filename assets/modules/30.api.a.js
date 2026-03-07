const sendResponsibleEmailDraft = async (responsible, booking) => {
  if (!responsible?.email) return false;
  const payload = {
    responsibleEmail: responsible.email,
    responsibleName: responsible.name,
    requesterName: booking.requesterName,
    member1: booking.member1 || "",
    member2: booking.member2 || "",
    purpose: booking.purpose || "",
    date: booking.date,
    timeSlot: booking.timeSlot,
    room: booking.room,
    requesterEmail: booking.email || "",
    bookingId: booking.bookingId,
    baseUrl: window.location.origin,
  };

  try {
    const res = await fetch("/api/send-booking-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.message || "api_send_failed");
    }

    const notifications = load(storageKeys.notifications, []);
    notifications.push({
      to: responsible.email,
      subject: `ยืนยันการจองห้อง ${booking.room} วันที่ ${booking.date}`,
      createdAt: new Date().toISOString(),
      bookingId: booking.bookingId || booking.createdAt,
      channel: "api",
    });
    save(storageKeys.notifications, notifications);
    return { ok: true, via: "api" };
  } catch (err) {
    const subject = encodeURIComponent(`ยืนยันการจองห้อง ${booking.room} วันที่ ${booking.date}`);
    const body = encodeURIComponent(
      `กรุณายืนยันการจองห้อง\n\nผู้ขอ: ${booking.requesterName}\nสมาชิก: ${booking.member1 || "-"}, ${booking.member2 || "-"}\nวัตถุประสงค์: ${booking.purpose}\nวันที่: ${booking.date}\nเวลา: ${booking.timeSlot}\nห้อง: ${booking.room}`
    );
    const mailto = `mailto:${responsible.email}?subject=${subject}&body=${body}`;
    window.open(mailto, "_blank");
    return { ok: false, via: "mailto", reason: err?.message || "fallback_mailto" };
  }
};

const sendEquipmentReturnEmail = async (responsible, booking) => {
  if (!responsible?.email || !booking?.bookingId) return { ok: false, reason: "missing_data" };
  const payload = {
    responsibleEmail: responsible.email,
    responsibleName: responsible.name,
    requesterName: booking.name || booking.requesterName || "",
    requesterEmail: booking.email || "",
    item: booking.item || "",
    quantity: booking.quantity || "",
    date: booking.date || "",
    timeSlot: booking.timeSlot || "",
    bookingId: booking.bookingId,
    returnProofImage: booking.returnProofImage || "",
    baseUrl: window.location.origin,
  };
  try {
    const res = await fetch("/api/send-equipment-return-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.message || "send_failed");
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, reason: err?.message || "send_failed" };
  }
};

const sendEquipmentReturnBatchEmail = async (responsible, bookings) => {
  if (!responsible?.email || !Array.isArray(bookings) || !bookings.length) {
    return { ok: false, reason: "missing_data" };
  }
  const payload = {
    responsibleEmail: responsible.email,
    responsibleName: responsible.name,
    requesterName: bookings[0]?.name || bookings[0]?.requesterName || "",
    requesterEmail: bookings[0]?.email || "",
    bookings: bookings.map((b) => ({
      bookingId: b.bookingId,
      item: b.item || "",
      quantity: b.quantity || "",
      date: b.date || "",
      timeSlot: b.timeSlot || "",
    })),
    returnProofImage: bookings[0]?.returnProofImage || "",
    baseUrl: window.location.origin,
  };
  try {
    const res = await fetch("/api/send-equipment-return-batch-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.message || "send_failed");
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, reason: err?.message || "send_failed" };
  }
};

const sendBroadcastEmail = async ({ to, subject, message }) => {
  const recipients = Array.isArray(to)
    ? [...new Set(to.map((v) => String(v || "").trim().toLowerCase()).filter(Boolean))]
    : [];
  if (!recipients.length || !subject || !message) {
    return { ok: false, reason: "missing_data" };
  }
  try {
    const res = await fetch("/api/send-broadcast-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to: recipients, subject, message }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.message || "send_failed");
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, reason: err?.message || "send_failed" };
  }
};

const validateRegisterEmailOnServer = async (email) => {
  const value = String(email || "").trim().toLowerCase();
  if (!value) return { ok: false, reason: "required" };
  try {
    const res = await fetch("/api/validate-register-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: value }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, reason: body.reason || "invalid_email" };
    return { ok: true, email: body.email || value };
  } catch {
    return { ok: false, reason: "check_failed" };
  }
};

const sendRegisterOtpEmail = async ({ email, code, name }) => {
  try {
    const res = await fetch("/api/send-register-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: String(email || "").trim().toLowerCase(),
        code: String(code || "").trim(),
        name: String(name || "").trim(),
      }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, reason: body.message || "send_failed" };
    return { ok: true };
  } catch {
    return { ok: false, reason: "send_failed" };
  }
};

const getRegisterEmailErrorMessage = (reason) => {
  const isTh = getLang() === "th";
  if (reason === "required") return t("fillAll");
  if (reason === "invalid_format") return isTh ? "รูปแบบอีเมลไม่ถูกต้อง" : "Invalid email format.";
  if (reason === "disposable_domain") return isTh ? "ไม่อนุญาตให้อีเมลชั่วคราว" : "Disposable email is not allowed.";
  if (reason === "invalid_domain" || reason === "domain_not_found") {
    return isTh ? "โดเมนอีเมลไม่ถูกต้องหรือไม่มีอยู่จริง" : "Email domain is invalid or not found.";
  }
  if (reason === "check_failed") return isTh ? "ไม่สามารถตรวจสอบอีเมลได้ กรุณาลองใหม่" : "Could not validate email. Please try again.";
  return isTh ? "ไม่สามารถใช้อีเมลนี้สมัครได้" : "This email cannot be used for registration.";
};

const getRegisterOtpSendErrorMessage = () => {
  return getLang() === "th"
    ? "ส่งรหัสยืนยันไปยังอีเมลไม่สำเร็จ กรุณาตรวจสอบอีเมลแล้วลองใหม่"
    : "Failed to send OTP email. Please verify your email and try again.";
};

const getPasswordMismatchMessage = () => {
  return getLang() === "th" ? "รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน" : "Password and confirm password do not match.";
};

const setRegisterLoading = (active) => {
  const overlay = byId("registerLoadingOverlay");
  if (!overlay) return;
  overlay.hidden = !active;
  document.body.classList.toggle("no-scroll", Boolean(active));
};

const setupPasswordToggle = (inputId, toggleBtnId) => {
  const input = byId(inputId);
  const toggleBtn = byId(toggleBtnId);
  if (!input || !toggleBtn) return;
  const icon =
    toggleBtn.querySelector(".password-toggle-icon") ||
    (() => {
      const img = document.createElement("img");
      img.className = "password-toggle-icon";
      img.alt = "toggle password";
      toggleBtn.appendChild(img);
      return img;
    })();

  const updateLabel = () => {
    const show = input.type === "text";
    icon.src = show ? "/image/eye.png" : "/image/hidden.png";
    toggleBtn.setAttribute(
      "aria-label",
      show
        ? (getLang() === "th" ? "????????????" : "Hide password")
        : (getLang() === "th" ? "????????????" : "Show password")
    );
  };

  toggleBtn.addEventListener("click", () => {
    input.type = input.type === "password" ? "text" : "password";
    updateLabel();
  });

  updateLabel();
};

const pickReturnProofImage = async () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.setAttribute("capture", "environment");
  return new Promise((resolve) => {
    input.addEventListener(
      "change",
      async () => {
        const file = input.files?.[0];
        if (!file) {
          resolve("");
          return;
        }
        try {
          const dataUrl = await fileToDataUrl(file);
          resolve(String(dataUrl || ""));
        } catch {
          resolve("");
        }
      },
      { once: true }
    );
    input.click();
  });
};

const askReturnProofViaModal = async () => {
  const modal = byId("equipmentReturnModal");
  const input = byId("equipmentReturnProofInput");
  const previewWrap = byId("equipmentReturnProofPreviewWrap");
  const preview = byId("equipmentReturnProofPreview");
  const confirmBtn = byId("equipmentReturnConfirmBtn");
  const cancelBtn = byId("equipmentReturnCancelBtn");
  if (!modal || !input || !previewWrap || !preview || !confirmBtn || !cancelBtn) {
    return pickReturnProofImage();
  }
  input.value = "";
  preview.src = "";
  previewWrap.hidden = true;
  modal.hidden = false;
  document.body.classList.add("no-scroll");
  return new Promise((resolve) => {
    let proofImage = "";
    const cleanup = () => {
      modal.hidden = true;
      document.body.classList.remove("no-scroll");
      input.removeEventListener("change", onChange);
      confirmBtn.removeEventListener("click", onConfirm);
      cancelBtn.removeEventListener("click", onCancel);
    };
    const onChange = async () => {
      const file = input.files?.[0];
      if (!file) {
        proofImage = "";
        preview.src = "";
        previewWrap.hidden = true;
        return;
      }
      try {
        proofImage = await fileToDataUrl(file);
        preview.src = proofImage;
        previewWrap.hidden = false;
      } catch {
        proofImage = "";
        preview.src = "";
        previewWrap.hidden = true;
      }
    };
    const onConfirm = () => {
      if (!proofImage) {
        alert(t("equipmentReturnProofRequired"));
        return;
      }
      cleanup();
      resolve(proofImage);
    };
    const onCancel = () => {
      cleanup();
      resolve("");
    };
    input.addEventListener("change", onChange);
    confirmBtn.addEventListener("click", onConfirm);
    cancelBtn.addEventListener("click", onCancel);
  });
};

const requestEquipmentReturn = async (bookingId, options = {}) => {
  const silent = Boolean(options.silent);
  const me = getCurrentUser();
  if (!me) return { ok: false, reason: "no_user" };
  const list = load(storageKeys.equipmentBookings, []);
  const index = list.findIndex((b) => b.bookingId === bookingId);
  if (index < 0) return { ok: false, reason: "not_found" };
  const item = list[index];
  if ((item.returnStatus || "borrowed") !== "borrowed") return { ok: false, reason: "invalid_status" };
  const responsible =
    getResponsibleStaff().find((s) => s.id === item.responsibleId) || getResponsibleStaff()[0];
  if (!item.responsibleId && responsible?.id) {
    item.responsibleId = responsible.id;
    save(storageKeys.equipmentBookings, list);
  }
  const proofImage =
    options.proofImage ||
    (options.askProofInModal ? await askReturnProofViaModal() : await pickReturnProofImage());
  if (!proofImage) {
    if (!silent) alert(t("equipmentReturnProofRequired"));
    return { ok: false, reason: "proof_required" };
  }
  item.returnProofImage = proofImage;
  item.returnProofAt = new Date().toISOString();
  item.returnBatchId = item.returnBatchId || `eqret-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const result = await sendEquipmentReturnEmail(responsible, item);
  if (!result.ok) {
    if (!silent) alert(`${t("equipmentReturnFailed")} (${result.reason || "unknown"})`);
    return { ok: false, reason: result.reason || "send_failed" };
  }
  item.returnStatus = "return_requested";
  item.returnRequestedAt = new Date().toISOString();
  save(storageKeys.equipmentBookings, list);
  if (!silent) alert(`${t("equipmentReturnConfirmSent")} | ${t("equipmentReturnRequested")}`);
  renderProfilePage();
  renderEquipmentCatalog();
  renderAdminEquipmentBorrowSummary();
  return { ok: true };
};

const requestMultipleEquipmentReturns = async (bookingIds, options = {}) => {
  if (!Array.isArray(bookingIds) || !bookingIds.length) return;
  const me = getCurrentUser();
  if (!me) return;
  const list = load(storageKeys.equipmentBookings, []);
  const selected = list.filter((b) => bookingIds.includes(b.bookingId));
  if (!selected.length) return;

  const targetResponsibleId = selected[0].responsibleId || "";
  const sameResponsible = selected.every((b) => (b.responsibleId || "") === targetResponsibleId);
  if (!sameResponsible) {
    alert(t("equipmentReturnMixedResponsible"));
    return;
  }
  const responsible =
    getResponsibleStaff().find((s) => s.id === targetResponsibleId) || getResponsibleStaff()[0];
  const borrowedOnly = selected.filter((b) => (b.returnStatus || "borrowed") === "borrowed");
  if (!borrowedOnly.length) return;
  const batchId = `eqret-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const proofImage = options.askProofInModal
    ? await askReturnProofViaModal()
    : await pickReturnProofImage();
  if (!proofImage) {
    alert(t("equipmentReturnProofRequired"));
    return;
  }
  borrowedOnly.forEach((b) => {
    b.returnProofImage = proofImage;
    b.returnProofAt = new Date().toISOString();
    b.returnBatchId = batchId;
  });

  const result = await sendEquipmentReturnBatchEmail(responsible, borrowedOnly);
  if (!result.ok) {
    alert(`${t("equipmentReturnFailed")} (${result.reason || "unknown"})`);
    return;
  }

  borrowedOnly.forEach((b) => {
    b.returnStatus = "return_requested";
    b.returnRequestedAt = new Date().toISOString();
  });
  save(storageKeys.equipmentBookings, list);
  alert(`${t("equipmentReturnConfirmSent")} | ${t("equipmentReturnRequested")}`);
  renderProfilePage();
  renderEquipmentCatalog();
  renderAdminEquipmentBorrowSummary();
};

const syncEquipmentReturns = async () => {
  try {
    const res = await fetch("/api/confirmed-equipment-returns");
    if (!res.ok) return;
    const body = await res.json();
    if (!Array.isArray(body.items)) return;
    const map = new Map(body.items.map((i) => [i.bookingId, i]));
    const list = load(storageKeys.equipmentBookings, []);
    let changed = false;
    list.forEach((b) => {
      const hit = map.get(b.bookingId);
      if (!hit) return;
      if (b.returnStatus !== "returned") {
        b.returnStatus = "returned";
        b.returnedAt = hit.confirmedAt || new Date().toISOString();
        changed = true;
      }
    });
    if (changed) save(storageKeys.equipmentBookings, list);
    if (changed) renderAdminEquipmentBorrowSummary();
  } catch {
    // API may be unavailable on static host.
  }
};

const registerForm = () => {
  const form = byId("registerForm");
  if (!form) return;
  setupPasswordToggle("regPassword", "toggleRegPassword");
  setupPasswordToggle("regConfirmPassword", "toggleRegConfirmPassword");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = byId("regName").value.trim();
    const studentId = byId("regStudentId").value.trim();
    const year = byId("regYear").value.trim();
    const school = byId("regSchool").value.trim();
    const major = byId("regMajor").value.trim();
    const phone = byId("regPhone").value.trim();
    const username = byId("regUsername").value.trim();
    const email = byId("regEmail").value.trim().toLowerCase();
    const password = byId("regPassword").value.trim();
    const confirmPassword = byId("regConfirmPassword")?.value.trim() || "";
    const profileFile = byId("regProfileImage")?.files?.[0];
    const notice = byId("registerNotice");

    if (!name || !studentId || !year || !school || !major || !phone || !username || !email || !password || !confirmPassword) {
      setNotice(notice, t("fillAll"), "error");
      return;
    }
    if (password !== confirmPassword) {
      setNotice(notice, getPasswordMismatchMessage(), "error");
      return;
    }

    setRegisterLoading(true);

    const emailCheck = await validateRegisterEmailOnServer(email);
    if (!emailCheck.ok) {
      setRegisterLoading(false);
      setNotice(notice, getRegisterEmailErrorMessage(emailCheck.reason), "error");
      return;
    }

    const users = load(storageKeys.users);
    if (users.some((u) => u.email === email)) {
      setRegisterLoading(false);
      setNotice(notice, t("emailUsed"), "error");
      return;
    }
    if (users.some((u) => (u.username || "").toLowerCase() === username.toLowerCase())) {
      setRegisterLoading(false);
      setNotice(notice, t("usernameUsed"), "error");
      return;
    }
    if (users.some((u) => (u.studentId || "").toLowerCase() === studentId.toLowerCase())) {
      setRegisterLoading(false);
      setNotice(notice, t("studentIdUsed"), "error");
      return;
    }

    const verificationCode = String(Math.floor(100000 + Math.random() * 900000));
    const otpSent = await sendRegisterOtpEmail({
      email,
      code: verificationCode,
      name,
    });
    if (!otpSent.ok) {
      setRegisterLoading(false);
      setNotice(notice, getRegisterOtpSendErrorMessage(), "error");
      return;
    }

    let profileImage = "";
    if (profileFile) {
      try {
        profileImage = await optimizeImageFileToDataUrl(profileFile, 420, 0.78);
      } catch {
        try {
          profileImage = await fileToDataUrl(profileFile);
        } catch {
          profileImage = "";
        }
      }
    }
    users.push({
      name,
      studentId,
      year,
      school,
      major,
      phone,
      profileImage,
      username,
      email,
      password,
      verified: false,
      verificationCode,
      verificationExpireAt: Date.now() + 10 * 60 * 1000,
      role: "user",
      roomQuotaDaily: 1,
      roomQuotaWeekly: 3,
    });
    save(storageKeys.users, users);

    setNotice(notice, getLang() === "th" ? "สมัครสำเร็จ ระบบส่งรหัส 6 หลักไปยังอีเมลแล้ว" : "Registered successfully. OTP has been sent to your email.");
    try {
      sessionStorage.setItem("pendingVerifyEmail", email);
    } catch {}
    form.reset();
    setTimeout(() => {
      setRegisterLoading(false);
      location.href = `verify.html?email=${encodeURIComponent(email)}`;
    }, 400);
  });
};

const verifyForm = () => {
  const form = byId("verifyForm");
  if (!form) return;
  const emailInput = byId("verifyEmail");
  const emailFromQuery = new URLSearchParams(location.search).get("email") || "";
  let emailPrefill = String(emailFromQuery || "").trim();
  if (!emailPrefill) {
    try {
      emailPrefill = String(sessionStorage.getItem("pendingVerifyEmail") || "").trim();
    } catch {}
  }
  if (emailInput && emailPrefill) emailInput.value = emailPrefill;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = byId("verifyEmail").value.trim().toLowerCase();
    const code = byId("verifyCode").value.trim().replace(/\D/g, "");
    const notice = byId("verifyNotice");

    const users = load(storageKeys.users);
    const user = users.find((u) => u.email === email);

    if (!user) {
      setNotice(notice, t("userNotFound"), "error");
      return;
    }

    if (user.verificationCode !== code) {
      setNotice(notice, t("verifyWrong"), "error");
      return;
    }
    if (user.verificationExpireAt && Date.now() > Number(user.verificationExpireAt)) {
      setNotice(notice, getLang() === "th" ? "รหัสยืนยันหมดอายุ กรุณาสมัครใหม่" : "Verification code expired. Please register again.", "error");
      return;
    }

    user.verified = true;
    user.verificationCode = "";
    user.verificationExpireAt = 0;
    save(storageKeys.users, users);
    setNotice(notice, t("verifySuccess"));
    try {
      sessionStorage.removeItem("pendingVerifyEmail");
    } catch {}
    form.reset();
    setTimeout(() => {
      location.href = "login.html";
    }, 450);
  });
};

const refreshSessionLabel = () => {
  const current = byId("currentSession");
  const logoutBtn = byId("logoutBtn");
  if (!current) return;
  const user = getCurrentUser();
  if (logoutBtn) logoutBtn.hidden = !user;
  current.textContent = user
    ? t("sessionText", { username: user.username, role: roleLabel(user.role) })
    : t("notLogin");
};

const loginForm = () => {
  const form = byId("loginForm");
  if (!form) return;
  setupPasswordToggle("loginPassword", "toggleLoginPassword");

  refreshSessionLabel();

  byId("logoutBtn")?.addEventListener("click", () => {
    localStorage.removeItem(storageKeys.session);
    setNotice(byId("loginNotice"), t("logoutSuccess"));
    refreshSessionLabel();
    lockAdminUiImmediately();
    setupAdminNav();
    setupAuthNav();
    ensureAdminAccess();
    updateBookingAuthUI();
    updateNavAuthState();
    renderAnnouncements();
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const loginId = byId("loginEmail").value.trim();
    const password = byId("loginPassword").value.trim();
    const notice = byId("loginNotice");

    const users = load(storageKeys.users);
    const user = users.find(
      (u) =>
        ((u.email || "").toLowerCase() === loginId.toLowerCase() ||
          (u.username || "").toLowerCase() === loginId.toLowerCase()) &&
        u.password === password
    );

    if (!user) {
      setNotice(notice, t("loginFail"), "error");
      return;
    }

    if (!user.verified) {
      setNotice(notice, t("notVerified"), "error");
      return;
    }
    if (user.suspended) {
      setNotice(
        notice,
        getLang() === "th"
          ? "บัญชีถูกระงับชั่วคราว กรุณาติดต่อแอดมิน"
          : "This account is temporarily suspended. Please contact admin.",
        "error"
      );
      return;
    }

    save(storageKeys.session, {
      username: user.username,
      email: user.email,
      name: user.name,
      role: user.role,
      loginAt: new Date().toISOString(),
    });

    setNotice(notice, t("loginSuccess"));
    refreshSessionLabel();
    form.reset();
    setupAdminNav();
    setupAuthNav();
    ensureAdminAccess();
    updateBookingAuthUI();
    updateNavAuthState();
    renderAnnouncements();
    if (isCurrentPage("login.html")) {
      location.href = "index.html";
    }
  });
};

const bookingForm = ({ formId, noticeId, key, mapData }) => {
  const form = byId(formId);
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = mapData();
    const notice = byId(noticeId);
    if (
      (key === storageKeys.roomBookings || key === storageKeys.equipmentBookings) &&
      !getCurrentUser()
    ) {
      setNotice(notice, t("loginRequiredToBook"), "error");
      return;
    }
    let hasEmpty = false;
    if (key === storageKeys.roomBookings) {
      hasEmpty = !String(data.requesterName || "").trim() ||
        !String(data.date || "").trim() ||
        !String(data.timeSlot || "").trim() ||
        !String(data.purpose || "").trim();
    } else if (key === storageKeys.equipmentBookings) {
      hasEmpty =
        !String(data.name || "").trim() ||
        !String(data.item || "").trim() ||
        !String(data.quantity || "").trim() ||
        !String(data.date || "").trim() ||
        !String(data.timeSlot || "").trim() ||
        !String(data.responsibleId || "").trim();
    } else {
      hasEmpty = Object.values(data).some((v) => !String(v).trim());
    }
    if (hasEmpty) {
      setNotice(notice, t("fillAll"), "error");
      return;
    }

    if (key === storageKeys.roomBookings) {
      if (!String(data.responsibleId || "").trim()) {
        setNotice(notice, t("responsibleRequired"), "error");
        return;
      }
      const currentUser = getCurrentUser();
      const quota = getRoomQuota(currentUser);
      const myBookings = load(storageKeys.roomBookings, [])
        .filter((b) => isBookingOwnedByUser(b, currentUser))
        .filter((b) => b.status !== "rejected");
      const dayCount = myBookings.filter((b) => b.date === data.date).length;
      if (dayCount >= quota.daily) {
        setNotice(notice, t("roomLimitPerDayQuota", { limit: quota.daily }), "error");
        return;
      }
      const selectedWeek = weekKey(data.date);
      const weekCount = myBookings.filter((b) => weekKey(b.date) === selectedWeek).length;
      if (weekCount >= quota.weekly) {
        setNotice(notice, t("roomLimitPerWeekQuota", { limit: quota.weekly }), "error");
        return;
      }
      const selected = {
        room: String(data.room || ""),
        date: String(data.date || ""),
        timeSlot: String(data.timeSlot || ""),
      };
      const slotCount = roomBookingsBySelection(selected).reduce(
        (sum, b) => sum + Number(b.participantCount || 1),
        0
      );
      const nextCount = Number(data.participantCount || 1);
      if (slotCount + nextCount > 20) {
        setNotice(notice, t("roomFull"), "error");
        renderRoomSlots();
        return;
      }
    }
    if (key === storageKeys.equipmentBookings) {
      if (!String(data.responsibleId || "").trim()) {
        setNotice(notice, t("responsibleRequired"), "error");
        return;
      }
      if (!String(data.itemId || "").trim()) {
        setNotice(notice, t("fillAll"), "error");
        return;
      }
      const me = getCurrentUser();
      const matched = load(storageKeys.roomBookings, [])
        .filter((b) => b.status === "approved")
        .filter((b) => isBookingOwnedByUser(b, me))
        .some((b) => b.date === data.date && b.timeSlot === data.timeSlot);
      if (!matched) {
        setNotice(notice, t("equipmentNeedRoom"), "error");
        return;
      }
      const available = getAvailableQtyByItemId(data.itemId);
      const needed = Math.max(1, Number(data.quantity || 1));
      if (available <= 0 || needed > available) {
        setNotice(notice, t("equipmentOutOfStock"), "error");
        return;
      }
    }

    const list = load(key);
    const base = { ...data, createdAt: new Date().toISOString() };
    if (key === storageKeys.roomBookings) {
      base.bookingId = base.bookingId || `bk-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    }
    if (key === storageKeys.equipmentBookings) {
      base.bookingId = base.bookingId || `eqb-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      base.returnStatus = base.returnStatus || "borrowed";
    }
    if (key === storageKeys.roomBookings) {
      base.status = "pending";
      base.approvedBy = "-";
    }
    list.push(base);
    save(key, list);

    setNotice(notice, t("bookingSaved"));
    if (key === storageKeys.roomBookings) {
      const responsible = getResponsibleStaff().find((s) => s.id === base.responsibleId);
      const mailResult = await sendResponsibleEmailDraft(responsible, base);
      setNotice(
        notice,
        mailResult.ok
          ? `${t("bookingSaved")} | ${t("emailSent")}`
          : `${t("bookingSaved")} | ${t("emailNotify")} (${mailResult.reason || "fallback"})`
      );
    }
    form.reset();
    if (key === storageKeys.roomBookings) {
      const hidden = byId("selectedResponsibleId");
      if (hidden) hidden.value = getResponsibleStaff()[0]?.id || "";
    }
    if (key === storageKeys.equipmentBookings) {
      const hidden = byId("eqSelectedResponsibleId");
      if (hidden) hidden.value = getResponsibleStaff()[0]?.id || "";
      selectedEquipmentItemId = "";
      syncEquipmentEligibility();
    }
    renderDashboard();
    renderRoomApproval();
    renderRoomSlots();
    renderResponsibleOptions();
    renderEqResponsibleOptions();
    renderProfilePage();
    renderAdminUserProfilePanel();
  });
};

