function safeCall(fn, ...args) {
  if (typeof fn !== "function") return;
  try {
    return fn(...args);
  } catch (error) {
    console.error(error);
  }
}

function safeNamedCall(name, ...args) {
  if (!name || typeof globalThis[name] !== "function") return;
  try {
    return globalThis[name](...args);
  } catch (error) {
    console.error(error);
  }
}

const adminActions = () => {
  if (!isCurrentPage("admin.html")) return;
  if (!canAccessAdminPage()) return;
  setupAdminSectionTabs();
  setupAdminDataExport();
  setupAdminRoomClosureForm();
  if (typeof setupRoomZoneAdminEditor === "function") {
    setupRoomZoneAdminEditor();
  }
  if (typeof setupLabProjectsAdmin === "function") {
    setupLabProjectsAdmin();
  }

  const form = byId("announcementForm");
  const broadcastForm = byId("adminBroadcastForm");
  const broadcastGroup = byId("broadcastGroup");
  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!requireCapability("announcement_manage")) return;
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
    let image = cropState.croppedDataUrl;
    try {
      image = await persistImageSource(image, {
        category: "announcements",
        filenameBase: title || "announcement",
        maxSize: 1920,
        quality: 0.92,
      });
    } catch {
      setNotice(notice, t("imageRequired"), "error");
      return;
    }
    list.push({
      type: normalizeAnnouncementType(type),
      title,
      content,
      image,
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
    safeNamedCall("renderAdminAnnouncements");
    safeNamedCall("renderAnnouncements");
  });

  if (broadcastGroup && !broadcastGroup.dataset.bound) {
    broadcastGroup.dataset.bound = "1";
    broadcastGroup.addEventListener("change", () => {
      safeNamedCall("renderBroadcastRecipientList");
    });
  }

  if (broadcastForm && !broadcastForm.dataset.bound) {
    broadcastForm.dataset.bound = "1";
    broadcastForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!requireCapability("email_notify_manage")) return;
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
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;

    if (target.dataset.approveRoom !== undefined) {
      if (!requireCapability("room_approval_manage")) return;
      const index = Number(target.dataset.approveRoom);
      const rooms = sortRoomBookingsByUsageDesc(load(storageKeys.roomBookings));
      if (!rooms[index]) return;
      if (isBookingPastEndTime(rooms[index])) return;

      rooms[index].status = "approved";
      rooms[index].approvedBy = getSession().username;
      save(storageKeys.roomBookings, rooms);
      safeNamedCall("renderRoomApproval");
      safeNamedCall("renderDashboard");
      safeNamedCall("renderAdminUserProfilePanel");
      safeNamedCall("renderProfilePage");
      safeNamedCall("renderRoomSlots");
      return;
    }

    if (target.dataset.rejectRoom !== undefined) {
      if (!requireCapability("room_approval_manage")) return;
      const index = Number(target.dataset.rejectRoom);
      const rooms = sortRoomBookingsByUsageDesc(load(storageKeys.roomBookings));
      if (!rooms[index]) return;
      if (isBookingPastEndTime(rooms[index])) return;

      rooms[index].status = "rejected";
      rooms[index].approvedBy = getSession().username;
      save(storageKeys.roomBookings, rooms);
      safeNamedCall("renderRoomApproval");
      safeNamedCall("renderDashboard");
      safeNamedCall("renderAdminUserProfilePanel");
      safeNamedCall("renderProfilePage");
      safeNamedCall("renderRoomSlots");
      return;
    }

    if (target.dataset.setUserRole !== undefined) {
      if (!isPrimaryAdminSession()) return;
      const index = Number(target.dataset.setUserRole);
      const nextRole = normalizeUserRole(target.dataset.roleValue);
      const users = load(storageKeys.users, []);
      if (!users[index]) return;
      const pickedUsername = String(users[index].username || "").trim().toLowerCase();
      if (pickedUsername === "anantachai2000") return;
      users[index].role = nextRole;
      users[index].verified = true;
      users[index].updatedAt = new Date().toISOString();
      save(storageKeys.users, users);
      const session = getSession();
      if (session && session.username === users[index].username) {
        save(storageKeys.session, {
          ...session,
          role: nextRole,
        });
        setupAdminNav();
        updateNavAuthState();
      }
      safeNamedCall("renderAdminUsers");
      safeNamedCall("renderAdminUserProfilePanel");
      safeNamedCall("renderBroadcastRecipientList");
      safeNamedCall("renderProfilePage");
      return;
    }

    if (target.dataset.promoteUser !== undefined) {
      if (!requireCapability("role_promote_admin")) return;
      const index = Number(target.dataset.promoteUser);
      const users = load(storageKeys.users, []);
      if (!users[index]) return;

      users[index].role = "admin";
      users[index].verified = true;
      users[index].updatedAt = new Date().toISOString();
      save(storageKeys.users, users);
      const session = getSession();
      if (session && session.username === users[index].username) {
        save(storageKeys.session, {
          ...session,
          role: "admin",
        });
        setupAdminNav();
        updateNavAuthState();
      }
      safeNamedCall("renderAdminUsers");
      safeNamedCall("renderAdminUserProfilePanel");
      safeNamedCall("renderBroadcastRecipientList");
      return;
    }

    if (target.dataset.promoteTeacher !== undefined) {
      if (!requireCapability("role_promote_teacher")) return;
      const index = Number(target.dataset.promoteTeacher);
      const users = load(storageKeys.users, []);
      if (!users[index]) return;

      users[index].role = "teacher";
      users[index].verified = true;
      users[index].updatedAt = new Date().toISOString();
      save(storageKeys.users, users);
      const session = getSession();
      if (session && session.username === users[index].username) {
        save(storageKeys.session, {
          ...session,
          role: "teacher",
        });
        setupAdminNav();
        updateNavAuthState();
      }
      safeNamedCall("renderAdminUsers");
      safeNamedCall("renderAdminUserProfilePanel");
      safeNamedCall("renderBroadcastRecipientList");
      return;
    }

    if (target.dataset.addQuotaUser !== undefined) {
      if (!requireCapability("user_quota_manage")) return;
      const index = Number(target.dataset.addQuotaUser);
      openAdminQuotaModal(index);
      return;
    }

    if (target.dataset.verifyUser !== undefined) {
      const index = Number(target.dataset.verifyUser);
      const users = load(storageKeys.users, []);
      if (!users[index]) return;
      const user = users[index];
      if (!user.verified) {
        if (!requireCapability("user_verify_manage")) return;
        user.verified = true;
        user.suspended = false;
      } else {
        if (!requireCapability("user_suspend_manage")) return;
        user.suspended = !Boolean(user.suspended);
      }
      user.updatedAt = new Date().toISOString();
      save(storageKeys.users, users);
      safeNamedCall("renderAdminUsers");
      safeNamedCall("renderAdminUserProfilePanel");
      return;
    }

    if (target.dataset.remindReturn !== undefined) {
      if (!requireCapability("equipment_summary_manage")) return;
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
      const subject = `à¹à¸ˆà¹‰à¸‡à¹€à¸•à¸·à¸­à¸™à¸„à¸·à¸™à¸­à¸¸à¸›à¸à¸£à¸“à¹Œ ${booking.item || ""}`;
      const message = [
        `à¸ªà¸§à¸±à¸ªà¸”à¸µ ${booking.name || booking.requesterName || booking.username || ""}`,
        "",
        `à¸à¸£à¸¸à¸“à¸²à¸„à¸·à¸™à¸­à¸¸à¸›à¸à¸£à¸“à¹Œ: ${booking.item || "-"}`,
        `à¸ˆà¸³à¸™à¸§à¸™: ${booking.quantity || "-"}`,
        `à¸§à¸±à¸™à¸—à¸µà¹ˆà¹ƒà¸Šà¹‰à¸‡à¸²à¸™: ${booking.date || "-"}`,
        `à¹€à¸§à¸¥à¸²: ${booking.timeSlot || "-"}`,
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
      if (!requireCapability("user_view")) return;
      const index = Number(target.dataset.viewUserProfile);
      const users = load(storageKeys.users, []);
      const picked = users[index];
      if (!picked) return;
      selectedAdminUserProfileKey = picked.username || picked.email || "";
      safeNamedCall("renderAdminUserProfilePanel");
      return;
    }

    if (target.dataset.deleteAnnouncement !== undefined) {
      if (!requireCapability("announcement_manage")) return;
      if (!window.confirm(t("confirmDeleteAnnouncement"))) return;
      const index = Number(target.dataset.deleteAnnouncement);
      const list = load(storageKeys.announcements).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
      if (!list[index]) return;

      list.splice(index, 1);
      save(storageKeys.announcements, list);
      safeNamedCall("renderAdminAnnouncements");
      safeNamedCall("renderAnnouncements");
      return;
    }

    if (target.dataset.deleteRoomClosure !== undefined) {
      if (!requireCapability("room_closure_manage")) return;
      if (!window.confirm(t("confirmDeleteRoomClosure"))) return;
      const id = String(target.dataset.deleteRoomClosure || "").trim();
      const list = getRoomClosures().filter((item) => String(item.id || "") !== id);
      save(storageKeys.roomClosures, list);
      safeNamedCall("renderAdminRoomClosures");
      safeNamedCall("renderRoomSlots");
      return;
    }

    if (target.dataset.deleteResponsible !== undefined) {
      if (!requireCapability("responsible_manage")) return;
      if (!window.confirm(t("confirmDeleteResponsible"))) return;
      const index = Number(target.dataset.deleteResponsible);
      const list = getResponsibleStaff();
      if (!list[index]) return;
      list.splice(index, 1);
      save(storageKeys.responsibleStaff, list);
      safeNamedCall("renderResponsibleAdminList");
      const selected = byId("selectedResponsibleId");
      if (selected && selected.value && !list.some((s) => s.id === selected.value)) {
        selected.value = list[0]?.id || "";
      }
      safeNamedCall("renderResponsibleOptions");
      safeNamedCall("renderEqResponsibleOptions");
      safeNamedCall("renderBroadcastRecipientList");
      safeNamedCall("renderHomeAboutSection");
      return;
    }

    if (target.dataset.deleteStaffPosition !== undefined) {
      if (!requireCapability("responsible_manage")) return;
      const position = String(target.dataset.deleteStaffPosition || "").trim();
      if (!position) return;
      const list = getResponsibleStaff();
      if (list.some((item) => String(item.position || "").trim() === position)) {
        setNotice(
          byId("responsibleNotice"),
          getLang() === "th" ? "ไม่สามารถลบหมวดหมู่ที่มีบุคลากรใช้งานอยู่" : "Cannot delete a position that is already in use.",
          "error"
        );
        return;
      }
      save(storageKeys.staffPositions, getStaffPositions().filter((item) => item !== position));
      safeNamedCall("renderResponsiblePositionOptions");
      safeNamedCall("renderResponsiblePositionList");
      safeNamedCall("renderHomeAboutSection");
      return;
    }

    if (target.dataset.deleteUser !== undefined) {
      if (!requireCapability("user_delete_manage")) return;
      if (!window.confirm(t("confirmDeleteUser"))) return;
      const index = Number(target.dataset.deleteUser);
      const users = load(storageKeys.users, []);
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
      safeNamedCall("renderAdminUsers");
      safeNamedCall("renderAdminUserProfilePanel");
      safeNamedCall("renderResponsibleOptions");
      safeNamedCall("renderEqResponsibleOptions");
      safeNamedCall("renderBroadcastRecipientList");
    }
  });

  safeNamedCall("renderRoomApproval");
  safeNamedCall("renderAdminUsers");
  safeNamedCall("renderAdminUserProfilePanel");
  safeNamedCall("renderAdminEquipmentBorrowSummary");
  safeNamedCall("renderBroadcastRecipientList");
  safeNamedCall("renderAdminAnnouncements");
  if (typeof renderAdminLabProjects === "function") {
    safeNamedCall("renderAdminLabProjects");
  }
  safeNamedCall("renderResponsibleAdminList");
  safeNamedCall("renderAdminRoomClosures");
};

const isAnyCurrentPage = (...pages) => pages.some((page) => isCurrentPage(page));

const syncApprovalsAndReturns = () =>
  Promise.all([
    typeof syncResponsibleApprovals === "function" ? syncResponsibleApprovals() : Promise.resolve(),
    typeof syncEquipmentReturns === "function" ? syncEquipmentReturns() : Promise.resolve(),
  ]);

const deferSharedStorageInit = () =>
  new Promise((resolve) => {
    const kick = () => {
      initSharedStorage()
        .then(resolve)
        .catch(() => resolve(false));
    };
    if (typeof window.requestIdleCallback === "function") {
      window.requestIdleCallback(kick, { timeout: 1200 });
      return;
    }
    window.setTimeout(kick, 0);
  });

const bootstrapApp = async () => {
  setupClientHardening();
  applyTranslations();
  setupLanguageSelector();
  setupProfileMiniMenuDismiss();
  activeNav();
  setupFastNavUX();
  prefetchNavPages();
  updateNavAuthState();
  setFooterYear();
  setupAuthNav();
  setupAdminNav();
  document.documentElement.classList.add("i18n-ready");

  seedAdmin();
  seedDemoUser();
  seedHomeInfo();
  seedResponsibleStaff();
  seedStaffPositions();
  seedEquipmentItems();
  seedEquipmentTypes();
  migrateLegacyData();
  normalizeEquipmentBookingsData();
  updateVisitorCounters();
  normalizeUsers();
  ensureAdminAccess();

  if (isCurrentPage("index.html")) {
    safeNamedCall("rerenderDynamicUi");
    safeNamedCall("setupHomeAboutSection");
    safeCall(setupHomeBottomEditor);
  }

  if (isCurrentPage("about.html")) {
    safeNamedCall("rerenderDynamicUi");
    safeNamedCall("setupHomeAboutSection");
  }

  if (isCurrentPage("profile.html")) {
    safeNamedCall("rerenderDynamicUi");
  }

  if (isCurrentPage("register.html")) safeCall(registerForm);
  if (isCurrentPage("verify.html")) safeCall(verifyForm);
  if (isCurrentPage("login.html")) safeCall(loginForm);

  if (isCurrentPage("rooms.html")) {
    safeCall(updateBookingAuthUI);
    safeCall(setupRoomBookingUI);
    safeCall(bookingForm, {
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
          roomZone: String(byId("selectedRoomZone")?.value || "").trim(),
          roomZoneLabel: getRoomZoneById(String(byId("selectedRoomZone")?.value || "").trim())?.label || "",
          responsibleId: byId("selectedResponsibleId")?.value || "",
          participantCount,
        };
      },
    });
    safeNamedCall("rerenderDynamicUi");
  }

  if (isCurrentPage("equipment.html")) {
    safeCall(updateBookingAuthUI);
    safeNamedCall("setupEquipmentBookingUI");
    safeCall(setupEquipmentCropTool);
    safeCall(setupEquipmentAdminTools);
    safeNamedCall("rerenderDynamicUi");
  }

  if (isCurrentPage("admin.html")) {
    safeCall(setupCropTool);
    safeCall(refreshCropStatusByState);
    safeCall(setupResponsibleAdmin);
    safeCall(setupHomeBottomEditor);
    safeCall(setupAnnouncementEditor);
    safeNamedCall("setupLabProjectsAdmin");
    safeCall(setupAdminQuotaModal);
    safeNamedCall("rerenderDynamicUi");
    safeCall(adminActions);
  }

  const sharedChangedPromise = deferSharedStorageInit();

  if (isAnyCurrentPage("rooms.html", "profile.html", "admin.html")) {
    syncApprovalsAndReturns().then(() => {
      safeNamedCall("renderDashboard");
      safeNamedCall("renderRoomApproval");
      safeNamedCall("renderRoomSlots");
      safeNamedCall("renderProfilePage");
    });

    setInterval(() => {
      syncApprovalsAndReturns().then(() => {
        safeNamedCall("renderDashboard");
        safeNamedCall("renderRoomApproval");
        safeNamedCall("renderRoomSlots");
        safeNamedCall("renderProfilePage");
      });
    }, 30000);
  }

  const sharedChanged = await sharedChangedPromise;
  seedAdmin();
  seedDemoUser();
  normalizeUsers();
  updateNavAuthState();
  setupAuthNav();
  setupAdminNav();
  safeNamedCall("rerenderDynamicUi");
  if (sharedChanged && isCurrentPage("equipment.html")) {
    safeNamedCall("renderEquipmentCatalog");
    safeNamedCall("renderSelectedEquipmentList");
  }

  const needsSettlePass = isAnyCurrentPage("index.html", "about.html", "admin.html");
  if (needsSettlePass) {
    requestAnimationFrame(() => safeNamedCall("rerenderDynamicUi"));
    window.setTimeout(() => safeNamedCall("rerenderDynamicUi"), 80);
  }
};

bootstrapApp();



