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
      const isSuspended = Boolean(u.suspended);
      const verifyText = !isVerified
        ? t("verifyMemberBtn")
        : isSuspended
          ? (getLang() === "th" ? "ถูกระงับ" : "Suspended")
          : t("verifiedMemberBtn");
      const verifyClass = !isVerified ? "btn-small" : isSuspended ? "btn-small danger" : "btn-small success";
      const verifyLabel = !isVerified
        ? t("verifiedNo")
        : isSuspended
          ? (getLang() === "th" ? "ระงับ" : "suspended")
          : t("verifiedYes");
      return `<div class="admin-item">
        <div>
          <p><strong>${u.name}</strong> (${u.username})</p>
          <p class="muted">${u.email} | verify: ${verifyLabel} | role: ${roleLabel(u.role)}</p>
          <p class="muted">${u.studentId ? t("adminUserMeta", { studentId: u.studentId, year: u.year || "-", school: u.school || "-", major: u.major || "-", phone: u.phone || "-" }) : ""}</p>
        </div>
        <div>
          <button type="button" class="${verifyClass}" data-verify-user="${index}">${verifyText}</button>
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
