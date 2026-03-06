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
    const profileFile = byId("regProfileImage")?.files?.[0];
    const notice = byId("registerNotice");

    if (!name || !studentId || !year || !school || !major || !phone || !username || !email || !password) {
      setNotice(notice, t("fillAll"), "error");
      return;
    }

    const users = load(storageKeys.users);
    if (users.some((u) => u.email === email)) {
      setNotice(notice, t("emailUsed"), "error");
      return;
    }
    if (users.some((u) => (u.username || "").toLowerCase() === username.toLowerCase())) {
      setNotice(notice, t("usernameUsed"), "error");
      return;
    }
    if (users.some((u) => (u.studentId || "").toLowerCase() === studentId.toLowerCase())) {
      setNotice(notice, t("studentIdUsed"), "error");
      return;
    }

    const verificationCode = String(Math.floor(100000 + Math.random() * 900000));
    let profileImage = "";
    if (profileFile) {
      try {
        profileImage = await fileToDataUrl(profileFile);
      } catch {
        profileImage = "";
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
      role: "user",
      roomQuotaDaily: 1,
      roomQuotaWeekly: 3,
    });
    save(storageKeys.users, users);

    setNotice(notice, t("registerSuccess", { code: verificationCode }));
    form.reset();
  });
};

const verifyForm = () => {
  const form = byId("verifyForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = byId("verifyEmail").value.trim().toLowerCase();
    const code = byId("verifyCode").value.trim();
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

    user.verified = true;
    save(storageKeys.users, users);
    setNotice(notice, t("verifySuccess"));
    form.reset();
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

const renderRoomApproval = () => {
  const target = byId("roomApproveList");
  if (!target) return;

  const rooms = sortRoomBookingsByUsageDesc(load(storageKeys.roomBookings));
  target.innerHTML = rooms.length
    ? rooms
        .map((r, index) => {
          const status = r.status || "pending";
          const bookingEnded = isBookingPastEndTime(r);
          const canApprove = !bookingEnded && status !== "approved";
          const canReject = !bookingEnded && status !== "rejected";
          return `<div class="admin-item">
            <div>
              <p><strong>${r.room}</strong> · ${r.date} ${r.timeSlot}</p>
              <p class="muted">${t("booker")}: ${r.name} | ${t("purpose")}: ${r.purpose}</p>
              <p class="muted"><span class="pill ${statusClass(status)}">${statusLabel(status)}</span> | ${t("approvedBy")}: ${r.approvedBy || "-"}</p>
            </div>
            ${
              bookingEnded
                ? ""
                : `<div class="feed-actions-end inline-actions">
                    <button type="button" class="btn-small" data-approve-room="${index}" ${canApprove ? "" : "disabled"}>${t("statusApproved")}</button>
                    <button type="button" class="btn-small danger" data-reject-room="${index}" ${canReject ? "" : "disabled"}>${t("statusRejected")}</button>
                  </div>`
            }
          </div>`;
        })
        .join("")
    : `<p class="muted">${t("roomApprovalEmpty")}</p>`;
};

const getBroadcastRecipientsByGroup = (group = "all") => {
  const users = load(storageKeys.users, []);
  const staff = getResponsibleStaff();
  const map = new Map();
  const pushUnique = (entry) => {
    const email = String(entry.email || "").trim().toLowerCase();
    if (!email || map.has(email)) return;
    map.set(email, { ...entry, email });
  };

  if (group === "all" || group === "users") {
    users
      .filter((u) => u.role !== "admin")
      .forEach((u) =>
        pushUnique({
          email: u.email || "",
          name: u.name || u.username || "",
          kind: "user",
        })
      );
  }
  if (group === "all" || group === "staff") {
    staff.forEach((s) =>
      pushUnique({
        email: s.email || "",
        name: s.name || "",
        kind: "staff",
      })
    );
  }
  return [...map.values()];
};

const renderBroadcastRecipientList = () => {
  const box = byId("broadcastRecipientList");
  const groupSelect = byId("broadcastGroup");
  if (!box || !groupSelect) return;
  const group = groupSelect.value || "all";
  const recipients = getBroadcastRecipientsByGroup(group);
  const prevChecked = new Set(
    Array.from(box.querySelectorAll('input[type="checkbox"]:checked')).map((el) => el.value)
  );
  box.innerHTML = recipients.length
    ? recipients
        .map((r) => {
          const checked = prevChecked.size ? prevChecked.has(r.email) : true;
          const kindText =
            r.kind === "staff" ? t("adminBroadcastTargetStaff") : t("adminBroadcastTargetUser");
          return `<label class="recipient-item"><input type="checkbox" value="${r.email}" ${checked ? "checked" : ""} /> <span><strong>${r.name || "-"}</strong> (${kindText})<br>${r.email}</span></label>`;
        })
        .join("")
    : `<p class="muted">${t("recentEmpty")}</p>`;
};

const renderAdminEquipmentBorrowSummary = () => {
  const target = byId("adminEquipmentSummary");
  if (!target) return;

  const equipmentList = load(storageKeys.equipmentBookings, []);
  const roomList = load(storageKeys.roomBookings, []).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  const staffMap = new Map(getResponsibleStaff().map((s) => [String(s.id || ""), s]));
  const outstanding = equipmentList
    .filter((b) => (b.returnStatus || "borrowed") !== "returned")
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  const equipmentHtml = (() => {
    if (!outstanding.length) return `<p class="muted">${t("adminBorrowEmpty")}</p>`;
    const byItem = new Map();
    outstanding.forEach((b) => {
      const key = b.item || "-";
      byItem.set(key, (byItem.get(key) || 0) + 1);
    });
    const summaryRows = [...byItem.entries()]
      .map(([item, count]) => `<li>${item}: ${count}</li>`)
      .join("");
    return `
      <div class="admin-item">
        <div>
          <p><strong>${t("adminBorrowByItem")}</strong></p>
          <ul class="list">${summaryRows}</ul>
        </div>
        <div>
          <p class="muted">${t("adminBorrowOutstandingCount", { count: outstanding.length })}</p>
        </div>
      </div>
      <div class="admin-summary-scroll">
        ${outstanding
          .map((b) => {
            const canRemind = Boolean(String(b.email || "").trim());
            const owner = b.name || b.requesterName || b.username || "-";
            return `<div class="admin-item">
              <div>
                <p><strong>${b.item || "-"}</strong> x ${b.quantity || "-"}</p>
                <p class="muted">${t("adminBorrowUser")}: ${owner} | ${b.email || "-"}</p>
              <p class="muted">${t("adminBorrowDate")}: ${b.date || "-"} ${b.timeSlot ? `| ${b.timeSlot}` : ""}</p>
              <p class="muted">${t("adminBorrowStatus")}: <span class="pill ${b.returnStatus === "return_requested" ? "pending" : ""}">${equipmentReturnStatusLabel(b.returnStatus || "borrowed")}</span></p>
              ${
                b.returnProofImage
                  ? `<p class="muted">${t("equipmentReturnProofLabel")}:</p><img class="return-proof-thumb" src="${b.returnProofImage}" alt="return-proof" />`
                  : ""
              }
            </div>
              <div>
                <button type="button" class="btn-small danger" data-remind-return="${b.bookingId || ""}" ${canRemind ? "" : "disabled"}>${t("adminBorrowRemindBtn")}</button>
              </div>
            </div>`;
          })
          .join("")}
      </div>
    `;
  })();

  const roomHtml = (() => {
    if (!roomList.length) return `<p class="muted">${t("adminRoomSummaryEmpty")}</p>`;
    const pendingCount = roomList.filter((r) => (r.status || "pending") === "pending").length;
    const approvedCount = roomList.filter((r) => (r.status || "pending") === "approved").length;
    const rejectedCount = roomList.filter((r) => (r.status || "pending") === "rejected").length;

    return `
      <div class="admin-item">
        <div>
          <p><strong>${t("adminRoomSummaryTitle")}</strong></p>
          <p class="muted">${t("adminRoomSummaryHint")}</p>
        </div>
        <div>
          <p class="muted">${t("adminRoomPendingCount", { count: pendingCount })}</p>
          <p class="muted">${t("adminRoomApprovedCount", { count: approvedCount })}</p>
          <p class="muted">${t("adminRoomRejectedCount", { count: rejectedCount })}</p>
        </div>
      </div>
      <div class="admin-summary-scroll">
        ${roomList
          .map((r) => {
            const status = r.status || "pending";
            const responsible = staffMap.get(String(r.responsibleId || ""));
            const requester = r.requesterName || r.name || r.username || "-";
            return `<div class="admin-item">
              <div>
                <p><strong>${r.room || "Lab-F11"}</strong> · ${r.date || "-"} ${r.timeSlot || "-"}</p>
                <p class="muted">${t("booker")}: ${requester} | ${t("purpose")}: ${r.purpose || "-"}</p>
                <p class="muted">${t("adminRoomMembers")}: ${(r.member1 || "-")}, ${(r.member2 || "-")}</p>
                <p class="muted">${t("adminRoomResponsible")}: ${responsible?.name || "-"}</p>
                <p class="muted">${t("profileStatus")}: <span class="pill ${statusClass(status)}">${statusLabel(status)}</span> | ${t("approvedBy")}: ${r.approvedBy || "-"}</p>
              </div>
            </div>`;
          })
          .join("")}
      </div>
    `;
  })();

  target.innerHTML = `
    ${equipmentHtml}
    <hr />
    ${roomHtml}
  `;
};

const renderAdminUsers = () => {
  const target = byId("adminUserList");
  if (!target) return;
  const users = load(storageKeys.users);

  target.innerHTML = users
    .map((u, index) => {
      const isVerified = Boolean(u.verified);
      const verifyText = isVerified ? t("verifiedMemberBtn") : t("verifyMemberBtn");
      const verifyClass = isVerified ? "btn-small success" : "btn-small";
      return `<div class="admin-item">
        <div>
          <p><strong>${u.name}</strong> (${u.username})</p>
          <p class="muted">${u.email} | verify: ${u.verified ? t("verifiedYes") : t("verifiedNo")} | role: ${roleLabel(u.role)}</p>
          <p class="muted">${u.studentId ? t("adminUserMeta", { studentId: u.studentId, year: u.year || "-", school: u.school || "-", major: u.major || "-", phone: u.phone || "-" }) : ""}</p>
        </div>
        <div>
          <button type="button" class="${verifyClass}" data-verify-user="${index}" ${isVerified ? "disabled" : ""}>${verifyText}</button>
          <button type="button" class="btn-small" data-view-user-profile="${index}">${t("viewProfileBtn")}</button>
        </div>
      </div>`;
    })
    .join("");
};

let selectedAdminUserProfileKey = "";
let selectedAdminQuotaUserIndex = -1;

const closeAdminQuotaModal = () => {
  const modal = byId("adminQuotaModal");
  const form = byId("adminQuotaForm");
  const notice = byId("adminQuotaNotice");
  if (modal) modal.hidden = true;
  if (form) form.reset();
  if (notice) notice.hidden = true;
  selectedAdminQuotaUserIndex = -1;
};

const openAdminQuotaModal = (index) => {
  const users = load(storageKeys.users, []);
  const user = users[index];
  if (!user) return;
  const modal = byId("adminQuotaModal");
  const target = byId("adminQuotaTargetName");
  const currentText = byId("adminQuotaCurrentText");
  const amountInput = byId("adminQuotaAmountInput");
  if (!modal || !target || !currentText || !amountInput) return;
  const quota = getRoomQuota(user);
  selectedAdminQuotaUserIndex = index;
  target.textContent = `${user.name || "-"} (${user.username || "-"})`;
  currentText.textContent = t("adminQuotaCurrent", { daily: quota.daily, weekly: quota.weekly });
  amountInput.value = "1";
  modal.hidden = false;
};

const setupAdminQuotaModal = () => {
  const modal = byId("adminQuotaModal");
  const form = byId("adminQuotaForm");
  const cancelBtn = byId("adminQuotaCancelBtn");
  const amountInput = byId("adminQuotaAmountInput");
  if (!modal || !form || form.dataset.bound) return;
  form.dataset.bound = "1";

  cancelBtn?.addEventListener("click", closeAdminQuotaModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeAdminQuotaModal();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!requireAdminAction()) return;
    const users = load(storageKeys.users, []);
    const index = selectedAdminQuotaUserIndex;
    if (index < 0 || !users[index]) return;
    const raw = Number(amountInput?.value || 0);
    const amount = Math.floor(raw);
    if (!Number.isFinite(amount) || amount <= 0) {
      setNotice(byId("adminQuotaNotice"), t("fillAll"), "error");
      return;
    }
    const current = getRoomQuota(users[index]);
    users[index].roomQuotaWeekly = current.weekly + amount;
    users[index].roomQuotaDaily = current.daily;
    save(storageKeys.users, users);
    setNotice(
      byId("adminNotice"),
      t("adminAddQuotaSaved", {
        name: users[index].name || users[index].username || "-",
        weekly: users[index].roomQuotaWeekly,
      })
    );
    closeAdminQuotaModal();
    renderAdminUsers();
    renderAdminUserProfilePanel();
    renderProfilePage();
  });
};

const renderAdminUserProfilePanel = () => {
  const panel = byId("adminUserProfilePanel");
  const title = byId("adminUserProfileTitle");
  const view = byId("adminUserProfileView");
  if (!panel || !view) return;
  if (title) title.textContent = t("adminProfileTitle");

  const users = load(storageKeys.users, []);
  let user =
    users.find((u) => (u.username || u.email) === selectedAdminUserProfileKey) ||
    users.find((u) => u.username === selectedAdminUserProfileKey);
  if (!user) {
    panel.hidden = false;
    view.innerHTML = `<p class="muted">${t("adminProfileEmpty")}</p>`;
    return;
  }

  const roomList = load(storageKeys.roomBookings, [])
    .filter((b) => isBookingOwnedByUser(b, user))
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  const eqList = load(storageKeys.equipmentBookings, [])
    .filter((b) => isBookingOwnedByUser(b, user))
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  const userIndex = users.findIndex(
    (u) =>
      (u.username || u.email) === (user.username || user.email) ||
      u.username === user.username
  );
  const quota = getRoomQuota(user);
  const isAdminUser = user.role === "admin";

  panel.hidden = false;
  view.innerHTML = `
    <div class="admin-user-profile-wrap">
      <div class="admin-user-profile-head">
        <img src="${user.profileImage || "image/IconLab.png"}" alt="${user.name || user.username}" />
        <div>
          <p><strong>${user.name || "-"}</strong> (${user.username || "-"})</p>
          <p class="muted">${user.email || "-"}</p>
          <p class="muted">${t("adminUserMeta", { studentId: user.studentId || "-", year: user.year || "-", school: user.school || "-", major: user.major || "-", phone: user.phone || "-" })}</p>
          <p class="muted">${t("adminQuotaLabel", { daily: quota.daily, weekly: quota.weekly })}</p>
        </div>
      </div>
      <div class="inline-actions">
        <button type="button" class="btn-small" data-add-quota-user="${userIndex}">${t("adminAddQuotaBtn")}</button>
        <button type="button" class="btn-small" data-promote-user="${userIndex}" ${isAdminUser ? "disabled" : ""}>${t("navAdmin")}</button>
        <button type="button" class="btn-small danger" data-delete-user="${userIndex}">${t("deleteUserBtn")}</button>
      </div>
      <h4>${t("adminProfileRoomHistory")} (${roomList.length})</h4>
      <div class="admin-user-profile-list">
        ${
          roomList.length
            ? roomList
                .map(
                  (r) => `<div class="feed-item">
                    <p class="feed-meta">${new Date(r.createdAt).toLocaleString(localeByLang())}</p>
                    <p><strong>${r.room || "Lab-F11"}</strong> | ${r.date || "-"} | ${r.timeSlot || "-"}</p>
                    <p class="muted">${t("profilePurpose")}: ${r.purpose || "-"}</p>
                    <p class="muted">${t("profileStatus")}: <span class="pill ${statusClass(r.status || "pending")}">${statusLabel(r.status || "pending")}</span></p>
                  </div>`
                )
                .join("")
            : `<p class="muted">${t("profileNoRoomBookings")}</p>`
        }
      </div>
      <h4 style="margin-top:0.7rem;">${t("adminProfileEquipmentHistory")} (${eqList.length})</h4>
      <div class="admin-user-profile-list">
        ${
          eqList.length
            ? eqList
                .map(
                  (e) => `<div class="feed-item">
                    <p class="feed-meta">${new Date(e.createdAt).toLocaleString(localeByLang())}</p>
                    <p><strong>${e.item || "-"}</strong> ${t("profileQty")} ${e.quantity || "-"}</p>
                    <p class="muted">${t("profileUsageDate")}: ${e.date || "-"} ${e.timeSlot ? `| ${e.timeSlot}` : ""}</p>
                    <p class="muted">${t("profileDetail")}: ${e.detail || "-"}</p>
                    <p class="muted">${t("profileStatus")}: <span class="pill ${e.returnStatus === "returned" ? "approved" : e.returnStatus === "return_requested" ? "pending" : ""}">${equipmentReturnStatusLabel(e.returnStatus || "borrowed")}</span></p>
                  </div>`
                )
                .join("")
            : `<p class="muted">${t("profileNoEquipmentBookings")}</p>`
        }
      </div>
    </div>
  `;
};

const renderAdminAnnouncements = () => {
  const target = byId("adminAnnouncementList");
  if (!target) return;
  const announcements = load(storageKeys.announcements).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  target.innerHTML = announcements.length
    ? `<div class="admin-announce-grid">${announcements
        .map(
          (a, index) => `<div class="admin-announce-card">
            ${a.image ? `<img class="feed-image" src="${a.image}" alt="${a.title}" />` : ""}
            <p class="admin-announce-title"><strong>${a.title}</strong></p>
            <p class="admin-announce-type"><span class="pill approved">${announcementTypeLabel(a.type)}</span></p>
            <p class="muted admin-announce-content">${a.content}</p>
            <p class="muted admin-announce-meta">${a.author} | ${new Date(a.createdAt).toLocaleString(localeByLang())}</p>
            <div class="feed-actions-end">
              <button type="button" class="btn-small danger" data-delete-announcement="${index}">Delete</button>
            </div>
          </div>`
        )
        .join("")}</div>`
    : `<p class="muted">${t("adminAnnouncementEmpty")}</p>`;
};

const setupAdminSectionTabs = () => {
  if (!isCurrentPage("admin.html")) return;
  const tabButtons = Array.from(document.querySelectorAll("[data-admin-tab]"));
  const panels = Array.from(document.querySelectorAll("[data-admin-panel]"));
  if (!tabButtons.length || !panels.length) return;

  const applyTab = (tabKey) => {
    const next = String(tabKey || "").trim();
    const fallback = tabButtons[0]?.dataset.adminTab || "";
    const selected = tabButtons.some((btn) => btn.dataset.adminTab === next) ? next : fallback;
    tabButtons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.adminTab === selected);
    });
    panels.forEach((panel) => {
      panel.hidden = panel.dataset.adminPanel !== selected;
    });
  };

  const hashTab = String(location.hash || "").replace("#admin-", "").trim();
  applyTab(hashTab);

  tabButtons.forEach((btn) => {
    if (btn.dataset.bound === "1") return;
    btn.dataset.bound = "1";
    btn.addEventListener("click", () => {
      const tabKey = btn.dataset.adminTab || "";
      applyTab(tabKey);
      if (tabKey) {
        const nextHash = `#admin-${tabKey}`;
        if (location.hash !== nextHash) history.replaceState(null, "", nextHash);
      }
    });
  });
};
