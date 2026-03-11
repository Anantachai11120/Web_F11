const adminActions = () => {
  if (!isCurrentPage("admin.html")) return;
  if (!isAdminSession()) return;
  setupAdminSectionTabs();
  setupAdminDataExport();

  const form = byId("announcementForm");
  const broadcastForm = byId("adminBroadcastForm");
  const broadcastGroup = byId("broadcastGroup");
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!requireAdminAction()) return;
    const type = byId("announceType").value;
    const title = byId("announceTitle").value.trim();
    const content = byId("announceContent").value.trim();
    const notice = byId("adminNotice");
    const session = getSession();

    if (!type || !title || !content) {
      setNotice(notice, t("adminTypeMissing"), "error");
      return;
    }
    if (!cropState.croppedDataUrl) {
      setNotice(notice, t("imageRequired"), "error");
      return;
    }

    const list = load(storageKeys.announcements);
    list.push({
      type: normalizeAnnouncementType(type),
      title,
      content,
      image: cropState.croppedDataUrl,
      createdAt: new Date().toISOString(),
      author: session.username,
    });
    save(storageKeys.announcements, list);

    setNotice(notice, t("adminPostSaved"));
    form.reset();
    cropState.image = null;
    cropState.zoom = 1;
    cropState.offsetX = 0;
    cropState.offsetY = 0;
    cropState.croppedDataUrl = "";
    const cropStatus = byId("cropStatus");
    if (cropStatus) cropStatus.textContent = t("cropEmpty");
    const cropZoom = byId("cropZoom");
    const cropX = byId("cropX");
    const cropY = byId("cropY");
    if (cropZoom) cropZoom.value = "1";
    if (cropX) cropX.value = "0";
    if (cropY) cropY.value = "0";
    drawCropCanvas();
    renderAdminAnnouncements();
    renderAnnouncements();
  });

  if (broadcastGroup && !broadcastGroup.dataset.bound) {
    broadcastGroup.dataset.bound = "1";
    broadcastGroup.addEventListener("change", () => {
      renderBroadcastRecipientList();
    });
  }

  if (broadcastForm && !broadcastForm.dataset.bound) {
    broadcastForm.dataset.bound = "1";
    broadcastForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!requireAdminAction()) return;
      const notice = byId("adminBroadcastNotice");
      const subject = byId("broadcastSubject")?.value?.trim() || "";
      const message = byId("broadcastMessage")?.value?.trim() || "";
      if (!subject || !message) {
        setNotice(notice, t("adminBroadcastNoMessage"), "error");
        return;
      }
      const recipients = Array.from(
        document.querySelectorAll('#broadcastRecipientList input[type="checkbox"]:checked')
      )
        .map((el) => String(el.value || "").trim().toLowerCase())
        .filter(Boolean);
      if (!recipients.length) {
        setNotice(notice, t("adminBroadcastNoRecipients"), "error");
        return;
      }
      const result = await sendBroadcastEmail({ to: recipients, subject, message });
      if (!result.ok) {
        setNotice(notice, `${t("equipmentReturnFailed")} (${result.reason || "send_failed"})`, "error");
        return;
      }
      setNotice(notice, `${t("adminBroadcastSent")} (${recipients.length})`);
    });
  }

  document.addEventListener("click", (e) => {
    if (!requireAdminAction()) return;
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;

    if (target.dataset.approveRoom !== undefined) {
      const index = Number(target.dataset.approveRoom);
      const rooms = sortRoomBookingsByUsageDesc(load(storageKeys.roomBookings));
      if (!rooms[index]) return;
      if (isBookingPastEndTime(rooms[index])) return;

      rooms[index].status = "approved";
      rooms[index].approvedBy = getSession().username;
      save(storageKeys.roomBookings, rooms);
      renderRoomApproval();
      renderDashboard();
      renderAdminUserProfilePanel();
      renderProfilePage();
      renderRoomSlots();
      return;
    }

    if (target.dataset.rejectRoom !== undefined) {
      const index = Number(target.dataset.rejectRoom);
      const rooms = sortRoomBookingsByUsageDesc(load(storageKeys.roomBookings));
      if (!rooms[index]) return;
      if (isBookingPastEndTime(rooms[index])) return;

      rooms[index].status = "rejected";
      rooms[index].approvedBy = getSession().username;
      save(storageKeys.roomBookings, rooms);
      renderRoomApproval();
      renderDashboard();
      renderAdminUserProfilePanel();
      renderProfilePage();
      renderRoomSlots();
      return;
    }

    if (target.dataset.promoteUser !== undefined) {
      const index = Number(target.dataset.promoteUser);
      const users = load(storageKeys.users);
      if (!users[index]) return;

      users[index].role = "admin";
      users[index].verified = true;
      save(storageKeys.users, users);
      renderAdminUsers();
      renderAdminUserProfilePanel();
      renderBroadcastRecipientList();
      return;
    }

    if (target.dataset.addQuotaUser !== undefined) {
      const index = Number(target.dataset.addQuotaUser);
      openAdminQuotaModal(index);
      return;
    }

    if (target.dataset.verifyUser !== undefined) {
      const index = Number(target.dataset.verifyUser);
      const users = load(storageKeys.users);
      if (!users[index]) return;
      const user = users[index];
      if (!user.verified) {
        user.verified = true;
        user.suspended = false;
      } else {
        user.suspended = !Boolean(user.suspended);
      }
      save(storageKeys.users, users);
      renderAdminUsers();
      renderAdminUserProfilePanel();
      return;
    }

    if (target.dataset.remindReturn !== undefined) {
      const bookingId = String(target.dataset.remindReturn || "").trim();
      const notice = byId("adminEquipmentNotice");
      if (!bookingId) return;
      const list = load(storageKeys.equipmentBookings, []);
      const booking = list.find((b) => String(b.bookingId || "") === bookingId);
      if (!booking) return;
      const recipient = String(booking.email || "").trim().toLowerCase();
      if (!recipient) {
        setNotice(notice, t("adminBorrowNoEmail"), "error");
        return;
      }
      const subject = `แจ้งเตือนคืนอุปกรณ์ ${booking.item || ""}`;
      const message = [
        `สวัสดี ${booking.name || booking.requesterName || booking.username || ""}`,
        "",
        `กรุณาคืนอุปกรณ์: ${booking.item || "-"}`,
        `จำนวน: ${booking.quantity || "-"}`,
        `วันที่ใช้งาน: ${booking.date || "-"}`,
        `เวลา: ${booking.timeSlot || "-"}`,
      ].join("\n");
      sendBroadcastEmail({ to: [recipient], subject, message }).then((result) => {
        if (!result.ok) {
          setNotice(notice, `${t("equipmentReturnFailed")} (${result.reason || "send_failed"})`, "error");
          return;
        }
        setNotice(notice, t("adminBorrowReminderSent"));
      });
      return;
    }

    if (target.dataset.viewUserProfile !== undefined) {
      const index = Number(target.dataset.viewUserProfile);
      const users = load(storageKeys.users);
      const picked = users[index];
      if (!picked) return;
      selectedAdminUserProfileKey = picked.username || picked.email || "";
      renderAdminUserProfilePanel();
      return;
    }

    if (target.dataset.deleteAnnouncement !== undefined) {
      if (!window.confirm(t("confirmDeleteAnnouncement"))) return;
      const index = Number(target.dataset.deleteAnnouncement);
      const list = load(storageKeys.announcements).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
      if (!list[index]) return;

      list.splice(index, 1);
      save(storageKeys.announcements, list);
      renderAdminAnnouncements();
      renderAnnouncements();
      return;
    }

    if (target.dataset.deleteResponsible !== undefined) {
      if (!window.confirm(t("confirmDeleteResponsible"))) return;
      const index = Number(target.dataset.deleteResponsible);
      const list = getResponsibleStaff();
      if (!list[index]) return;
      list.splice(index, 1);
      save(storageKeys.responsibleStaff, list);
      renderResponsibleAdminList();
      const selected = byId("selectedResponsibleId");
      if (selected && selected.value && !list.some((s) => s.id === selected.value)) {
        selected.value = list[0]?.id || "";
      }
      renderResponsibleOptions();
      renderEqResponsibleOptions();
      renderBroadcastRecipientList();
      return;
    }

    if (target.dataset.deleteUser !== undefined) {
      if (!window.confirm(t("confirmDeleteUser"))) return;
      const index = Number(target.dataset.deleteUser);
      const users = load(storageKeys.users);
      const selected = users[index];
      if (!selected) return;
      const current = getCurrentUser();
      if (current && current.username === selected.username) {
        alert(t("cannotDeleteSelf"));
        return;
      }
      users.splice(index, 1);
      save(storageKeys.users, users);
      if (selectedAdminUserProfileKey && (selected.username === selectedAdminUserProfileKey || selected.email === selectedAdminUserProfileKey)) {
        selectedAdminUserProfileKey = "";
      }
      renderAdminUsers();
      renderAdminUserProfilePanel();
      renderResponsibleOptions();
      renderEqResponsibleOptions();
      renderBroadcastRecipientList();
    }
  });

  renderRoomApproval();
  renderAdminUsers();
  renderAdminUserProfilePanel();
  renderAdminEquipmentBorrowSummary();
  renderBroadcastRecipientList();
  renderAdminAnnouncements();
  renderResponsibleAdminList();
};

const bootstrapApp = async () => {
  setupClientHardening();
  applyTranslations();
  setupLanguageSelector();
  activeNav();
  setupFastNavUX();
  prefetchNavPages();
  updateNavAuthState();
  setFooterYear();
  setupAuthNav();
  setupAdminNav();
  document.documentElement.classList.add("i18n-ready");

  const sharedChanged = await initSharedStorage();

  seedAdmin();
  seedHomeInfo();
  seedResponsibleStaff();
  seedEquipmentItems();
  seedEquipmentTypes();
  migrateLegacyData();
  normalizeEquipmentBookingsData();
  updateVisitorCounters();
  normalizeUsers();
  ensureAdminAccess();
  renderAnnouncements();
  renderHomeBottomInfo();
  renderProfilePage();
  registerForm();
  verifyForm();
  loginForm();
  updateBookingAuthUI();
  setupRoomBookingUI();
  setupEquipmentBookingUI();
  setupCropTool();
  setupEquipmentCropTool();
  refreshCropStatusByState();
  adminActions();
  setupResponsibleAdmin();
  setupEquipmentAdminTools();
  setupHomeBottomEditor();
  setupAnnouncementEditor();
  setupAdminQuotaModal();
  bookingForm({
    formId: "roomBookingForm",
    noticeId: "roomNotice",
    key: storageKeys.roomBookings,
    mapData: () => {
      const me = getCurrentUser();
      const requesterName = byId("roomRequesterName")?.value?.trim() || "";
      const member1 = byId("roomMember1")?.value?.trim() || "";
      const member2 = byId("roomMember2")?.value?.trim() || "";
      const purposeType =
        document.querySelector('input[name="roomPurposeType"]:checked')?.value || "";
      const purposeOther = byId("roomPurposeOther")?.value?.trim() || "";
      const otherPurpose = "\u0E2D\u0E37\u0E48\u0E19\u0E46";
      const purpose = purposeType === otherPurpose ? (purposeOther || otherPurpose) : purposeType;
      const participantCount =
        [requesterName, member1, member2].filter((v) => Boolean(v)).length || 1;
      return {
        requesterName,
        member1,
        member2,
        name: requesterName,
        username: me?.username || "",
        email: me?.email || "",
        room: byId("roomFixed")?.value || "Lab-F11",
        date: byId("roomDate")?.value || "",
        timeSlot: byId("roomTime")?.value || "",
        purpose,
        purposeType,
        responsibleId: byId("selectedResponsibleId")?.value || "",
        participantCount,
      };
    },
  });

  Promise.all([syncResponsibleApprovals(), syncEquipmentReturns()]).then(() => {
    renderDashboard();
    renderRoomApproval();
    renderRoomSlots();
    renderProfilePage();
  });

  setInterval(() => {
    Promise.all([syncResponsibleApprovals(), syncEquipmentReturns()]).then(() => {
      renderDashboard();
      renderRoomApproval();
      renderRoomSlots();
      renderProfilePage();
    });
  }, 15000);

  if (!sharedChanged) return;
  normalizeUsers();
  updateNavAuthState();
  setupAuthNav();
  setupAdminNav();
  renderDashboard();
  renderAnnouncements();
  renderHomeBottomInfo();
  renderProfilePage();
  renderRoomSlots();
  renderRoomApproval();
  renderResponsibleOptions();
  renderEqResponsibleOptions();
  renderEquipmentCatalog();
  renderSelectedEquipmentList();
  renderAdminUsers();
  renderAdminUserProfilePanel();
  renderAdminEquipmentBorrowSummary();
  renderBroadcastRecipientList();
  renderAdminAnnouncements();
  renderResponsibleAdminList();
};

bootstrapApp();



