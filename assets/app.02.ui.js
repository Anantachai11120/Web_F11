let announcementEditorSaveHandler = null;

const normalizeAnnouncementType = (type) => {
  const raw = String(type || "").trim().toLowerCase();
  if (raw === "news" || raw === "ข่าวสาร") return "news";
  return "announcement";
};

const announcementTypeLabel = (type) =>
  normalizeAnnouncementType(type) === "news"
    ? t("announcementTypeNews")
    : t("announcementTypeAnnouncement");

const setAnnouncementEditorPreview = (src) => {
  const preview = byId("announcementEditorImagePreview");
  if (!preview) return;
  const value = String(src || "").trim();
  preview.hidden = !value;
  if (value) preview.src = value;
};

const closeAnnouncementEditor = () => {
  const modal = byId("announcementEditorModal");
  const form = byId("announcementEditorForm");
  const notice = byId("announcementEditorNotice");
  if (modal) modal.hidden = true;
  if (form) form.reset();
  if (notice) notice.hidden = true;
  setAnnouncementEditorPreview("");
  announcementEditorSaveHandler = null;
};

const openAnnouncementEditor = ({ mode = "create", announcement = null, onSave }) => {
  const modal = byId("announcementEditorModal");
  const title = byId("announcementEditorTitle");
  const type = byId("announcementEditorType");
  const titleInput = byId("announcementEditorTitleInput");
  const contentInput = byId("announcementEditorContentInput");
  const imageUrlInput = byId("announcementEditorImageUrlInput");
  const saveBtn = byId("announcementEditorSaveBtn");
  const closeBtn = byId("announcementEditorCloseBtn");
  const notice = byId("announcementEditorNotice");
  if (!modal || !type || !titleInput || !contentInput || !imageUrlInput || !title || !saveBtn) return;

  type.innerHTML = `
    <option value="announcement">${t("announcementTypeAnnouncement")}</option>
    <option value="news">${t("announcementTypeNews")}</option>
  `;
  title.textContent =
    mode === "edit" ? t("announcementEditorEditTitle") : t("announcementEditorCreateTitle");
  saveBtn.textContent = t("announcementEditorSaveBtn");
  if (closeBtn) closeBtn.textContent = t("announcementEditorCancelBtn");
  announcementEditorSaveHandler = onSave;
  if (notice) notice.hidden = true;
  if (announcement) {
    type.value = normalizeAnnouncementType(announcement.type);
    titleInput.value = announcement.title || "";
    contentInput.value = announcement.content || "";
    imageUrlInput.value = announcement.image || "";
    setAnnouncementEditorPreview(announcement.image || "");
  } else {
    type.value = "announcement";
    titleInput.value = "";
    contentInput.value = "";
    imageUrlInput.value = "";
    setAnnouncementEditorPreview("");
  }

  modal.hidden = false;
};

const setupAnnouncementEditor = () => {
  const modal = byId("announcementEditorModal");
  const form = byId("announcementEditorForm");
  if (!modal || !form || form.dataset.bound) return;
  form.dataset.bound = "1";

  const cancelBtn = byId("announcementEditorCancelBtn");
  const closeBtn = byId("announcementEditorCloseBtn");
  const imageUrlInput = byId("announcementEditorImageUrlInput");
  const imageFileInput = byId("announcementEditorImageFileInput");
  const notice = byId("announcementEditorNotice");

  cancelBtn?.addEventListener("click", closeAnnouncementEditor);
  closeBtn?.addEventListener("click", closeAnnouncementEditor);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeAnnouncementEditor();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) closeAnnouncementEditor();
  });

  imageUrlInput?.addEventListener("input", () => {
    setAnnouncementEditorPreview(imageUrlInput.value);
  });

  imageFileInput?.addEventListener("change", async (e) => {
    const file = e.target.files?.[0];
    if (!file || !imageUrlInput) return;
    try {
      const dataUrl = await fileToDataUrl(file);
      imageUrlInput.value = dataUrl;
      setAnnouncementEditorPreview(dataUrl);
    } catch {
      // Keep existing image URL if file read fails.
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const typeValue = byId("announcementEditorType")?.value || "announcement";
    const titleValue = byId("announcementEditorTitleInput")?.value?.trim() || "";
    const contentValue = byId("announcementEditorContentInput")?.value?.trim() || "";
    const imageValue = byId("announcementEditorImageUrlInput")?.value?.trim() || "";
    if (!titleValue || !contentValue) {
      setNotice(notice, t("fillAll"), "error");
      return;
    }
    if (typeof announcementEditorSaveHandler === "function") {
      announcementEditorSaveHandler({
        type: normalizeAnnouncementType(typeValue),
        title: titleValue,
        content: contentValue,
        image: imageValue,
      });
    }
    closeAnnouncementEditor();
  });
};

const setAnnouncementCardExpanded = (card, expanded) => {
  if (!(card instanceof HTMLElement)) return;
  const textNode = card.querySelector(".announcement-content");
  if (!(textNode instanceof HTMLElement)) return;
  const encodedFull = card.dataset.annFull || "";
  const encodedCompact = card.dataset.annCompact || "";
  const isLong = card.dataset.annLong === "1";
  const full = decodeURIComponent(encodedFull || "");
  const compact = decodeURIComponent(encodedCompact || "");
  card.classList.toggle("expanded", expanded);
  if (expanded) {
    textNode.className = "announcement-full announcement-content";
    textNode.textContent = full;
    const collapse = document.createElement("p");
    collapse.className = "announcement-collapse";
    collapse.textContent = t("announcementCollapse");
    const existing = card.querySelector(".announcement-collapse");
    if (existing) existing.remove();
    const body = card.querySelector(".announcement-body");
    body?.appendChild(collapse);
  } else {
    textNode.className = "announcement-excerpt announcement-content";
    textNode.innerHTML = `${compact}${isLong ? ` <span class="announcement-readmore">${t("announcementReadMore")}</span>` : ""}`;
    const existing = card.querySelector(".announcement-collapse");
    if (existing) existing.remove();
  }
};

const renderAnnouncements = () => {
  const target = byId("announcementList");
  if (!target) return;
  const loadMoreBtn = byId("announcementLoadMore");
  const quickAddBtn = byId("announcementQuickAdd");
  const countLabel = byId("announcementCountLabel");
  const page = location.pathname.split("/").pop() || "index.html";
  const canManage = page === "index.html" && isAdminSession();

  const raw = load(storageKeys.announcements, []);
  let changed = false;
  const normalized = raw.map((a, idx) => {
    if (a.id) return a;
    changed = true;
    return { ...a, id: `ann-${a.createdAt || Date.now()}-${idx}` };
  });
  if (changed) save(storageKeys.announcements, normalized);
  const announcements = normalized.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  const step = 6;
  const stateKey = "__announcementVisibleCount";
  const expandedKey = "__announcementExpandedId";
  if (typeof window[stateKey] !== "number" || window[stateKey] < step) {
    window[stateKey] = step;
  }
  const visibleCount = Math.min(window[stateKey], announcements.length);
  const visible = announcements.slice(0, visibleCount);

  target.innerHTML = visible.length
    ? visible
        .map((a, idx) => {
          const id = String(a.id || a.createdAt || idx);
          const expanded = window[expandedKey] === id;
          const content = String(a.content || "");
          const isLong = content.length > 140;
          const compact = isLong ? `${content.slice(0, 140).trim()}...` : content;
          return `<article class="announcement-card ${expanded ? "expanded" : ""} ${a.image ? "has-image" : "no-image"}" data-announcement-id="${id}" data-ann-full="${encodeURIComponent(content)}" data-ann-compact="${encodeURIComponent(compact)}" data-ann-long="${isLong ? "1" : "0"}">
              ${a.image ? `<img class="feed-image" src="${a.image}" alt="${a.title}" />` : ""}
              <div class="announcement-body">
                <p class="feed-meta">${announcementTypeLabel(a.type)} · ${new Date(a.createdAt).toLocaleString(localeByLang())}</p>
                <h4>${a.title}</h4>
                <p class="${expanded ? "announcement-full" : "announcement-excerpt"} announcement-content">
                  ${expanded ? content : compact}
                  ${!expanded && isLong ? ` <span class="announcement-readmore">${t("announcementReadMore")}</span>` : ""}
                </p>
                ${expanded ? `<p class="announcement-collapse">${t("announcementCollapse")}</p>` : ""}
                ${
                  canManage
                    ? `<div class="announcement-actions">
                        <button type="button" class="btn-small" data-ann-action="edit" data-announcement-id="${id}">${t("announcementEditBtn")}</button>
                        <button type="button" class="btn-small danger" data-ann-action="delete" data-announcement-id="${id}">${t("deleteBtn")}</button>
                      </div>`
                    : ""
                }
              </div>
            </article>`;
        })
        .join("")
    : `<p class="muted">${t("announcementEmpty")}</p>`;

  if (!target.dataset.bound) {
    target.dataset.bound = "1";
    target.addEventListener("click", (e) => {
      const node = e.target;
      if (!(node instanceof HTMLElement)) return;
      const actionBtn = node.closest("[data-ann-action]");
      if (actionBtn instanceof HTMLElement) {
        if (!isAdminSession()) return;
        const action = String(actionBtn.dataset.annAction || "");
        const id = String(actionBtn.dataset.announcementId || "");
        if (!id) return;
        const list = load(storageKeys.announcements, []);
        const index = list.findIndex((a) => String(a.id || "") === id || String(a.createdAt || "") === id);
        if (index < 0) return;
        if (action === "delete") {
          if (!window.confirm(t("confirmDeleteAnnouncement"))) return;
          list.splice(index, 1);
          save(storageKeys.announcements, list);
          renderAnnouncements();
          renderAdminAnnouncements();
          return;
        }
        if (action === "edit") {
          const current = list[index];
          openAnnouncementEditor({
            mode: "edit",
            announcement: current,
            onSave: (payload) => {
              list[index] = {
                ...current,
                title: payload.title || current.title || "",
                content: payload.content || current.content || "",
                type: payload.type || current.type || "announcement",
                image: payload.image || "",
                updatedAt: new Date().toISOString(),
              };
              save(storageKeys.announcements, list);
              renderAnnouncements();
              renderAdminAnnouncements();
            },
          });
          return;
        }
      }
      const card = node.closest("[data-announcement-id]");
      if (!(card instanceof HTMLElement)) return;
      const id = String(card.dataset.announcementId || "");
      if (!id) return;
      const currentExpanded = target.querySelector(".announcement-card.expanded");
      const willExpand = window[expandedKey] !== id;
      if (currentExpanded instanceof HTMLElement && currentExpanded !== card) {
        setAnnouncementCardExpanded(currentExpanded, false);
      }
      setAnnouncementCardExpanded(card, willExpand);
      window[expandedKey] = willExpand ? id : "";
    });
  }

  if (countLabel) {
    countLabel.textContent = announcements.length
      ? `${visibleCount}/${announcements.length}`
      : "";
  }
  if (loadMoreBtn) {
    loadMoreBtn.textContent = t("announcementLoadMore");
    loadMoreBtn.hidden = announcements.length <= visibleCount;
    if (!loadMoreBtn.dataset.bound) {
      loadMoreBtn.dataset.bound = "1";
      loadMoreBtn.addEventListener("click", () => {
        window[stateKey] = (window[stateKey] || step) + step;
        renderAnnouncements();
      });
    }
  }
  if (quickAddBtn) {
    quickAddBtn.textContent = t("announcementAddBtn");
    quickAddBtn.hidden = !canManage;
    if (!quickAddBtn.dataset.bound) {
      quickAddBtn.dataset.bound = "1";
      quickAddBtn.addEventListener("click", () => {
        if (!isAdminSession()) return;
        openAnnouncementEditor({
          mode: "create",
          onSave: (payload) => {
            const session = getSession();
            const list = load(storageKeys.announcements, []);
            list.push({
              id: `ann-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
              type: payload.type || "announcement",
              title: payload.title,
              content: payload.content,
              image: payload.image || "",
              createdAt: new Date().toISOString(),
              author: session?.username || "admin",
            });
            save(storageKeys.announcements, list);
            renderAnnouncements();
            renderAdminAnnouncements();
          },
        });
      });
    }
  }
};

const renderDashboard = () => {
  const users = load(storageKeys.users);
  const roomBookings = load(storageKeys.roomBookings);
  const equipmentBookings = load(storageKeys.equipmentBookings);

  const verifiedUsers = users.filter((u) => u.verified).length;
  const pendingRooms = roomBookings.filter((b) => b.status === "pending").length;

  byId("totalUsers") && (byId("totalUsers").textContent = users.length);
  byId("verifiedUsers") && (byId("verifiedUsers").textContent = verifiedUsers);
  byId("roomCount") && (byId("roomCount").textContent = roomBookings.length);
  byId("equipmentCount") && (byId("equipmentCount").textContent = equipmentBookings.length);
  byId("pendingRoomCount") && (byId("pendingRoomCount").textContent = pendingRooms);

  const recentList = byId("recentActivity");
  if (!recentList) return;

  const merged = [
    ...roomBookings.map((b) => ({
      time: b.createdAt,
      text: t("recentRoom", {
        room: b.room,
        date: b.date,
        timeSlot: b.timeSlot,
        status: statusLabel(b.status || "pending"),
      }),
    })),
    ...equipmentBookings.map((b) => ({
      time: b.createdAt,
      text: t("recentEquipment", { item: b.item, quantity: b.quantity }),
    })),
  ]
    .sort((a, b) => (a.time < b.time ? 1 : -1))
    .slice(0, 5);

  recentList.innerHTML = merged.length
    ? merged.map((item) => `<li>${item.text}</li>`).join("")
    : `<li>${t("recentEmpty")}</li>`;
};

const renderHomeBottomInfo = () => {
  const section = byId("labOrgName");
  if (!section) return;
  const info = { ...defaultHomeInfo, ...load(storageKeys.homeInfo, defaultHomeInfo) };

  byId("labOrgName").textContent = info.orgName || defaultHomeInfo.orgName;
  byId("labAddress").textContent = info.address || defaultHomeInfo.address;
  byId("labContactFacebook").textContent = info.contactFacebook || "-";
  byId("labContactInstagram").textContent = info.contactInstagram || "-";
  byId("labContactPhone").textContent = info.contactPhone || "-";
  byId("labVisitorsTotal").textContent = t("visitorsTotalText", { count: Number(info.visitorsTotal || 0) });
  byId("labVisitorsToday").textContent = t("visitorsTodayText", { count: Number(info.visitorsToday || 0) });
  byId("labManagerName").textContent = info.managerName || "-";
  byId("labManagerRole").textContent = info.managerRole || "-";
  if (byId("labManagerImage")) {
    byId("labManagerImage").src = info.managerImage || "image/IconLab.png";
  }
  if (byId("labMap")) {
    byId("labMap").src = info.mapUrl || defaultHomeInfo.mapUrl;
  }
  const managerSection = byId("labManagerSection");
  if (managerSection) {
    managerSection.hidden = info.managerVisible === false;
  }
  const units = Array.isArray(info.units) ? info.units : defaultHomeInfo.units;
  if (byId("labUnits")) {
    byId("labUnits").innerHTML = units.length
      ? units.map((u) => `<li>${u}</li>`).join("")
      : "<li>-</li>";
  }
};

const parseBookingStartAt = (booking) => {
  const date = String(booking?.date || "").trim();
  const timeSlotRaw = String(booking?.timeSlot || "").trim();
  if (!date || !timeSlotRaw) return null;
  const startRaw = timeSlotRaw.split("-")[0] || "";
  const cleaned = startRaw
    .replace(/[^\d:.]/g, "")
    .replace(/\./g, ":")
    .trim();
  const [hStr, mStr = "00"] = cleaned.split(":");
  const hh = Number(hStr);
  const mm = Number(mStr);
  if (!Number.isFinite(hh) || !Number.isFinite(mm)) return null;
  const dt = new Date(`${date}T${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:00`);
  return Number.isNaN(dt.getTime()) ? null : dt;
};

const parseBookingEndAt = (booking) => {
  const date = String(booking?.date || "").trim();
  const timeSlotRaw = String(booking?.timeSlot || "").trim();
  if (!date || !timeSlotRaw) return null;
  const endRaw = timeSlotRaw.split("-")[1] || "";
  const cleaned = endRaw
    .replace(/[^\d:.]/g, "")
    .replace(/\./g, ":")
    .trim();
  if (!cleaned) return null;
  const [hStr, mStr = "00"] = cleaned.split(":");
  const hh = Number(hStr);
  const mm = Number(mStr);
  if (!Number.isFinite(hh) || !Number.isFinite(mm)) return null;
  const dt = new Date(`${date}T${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:00`);
  return Number.isNaN(dt.getTime()) ? null : dt;
};

const isBookingPastEndTime = (booking) => {
  const endAt = parseBookingEndAt(booking);
  if (!endAt) return false;
  return Date.now() > endAt.getTime();
};

const canCancelBookingWithinWindow = (booking, graceMinutes = 15) => {
  const startAt = parseBookingStartAt(booking);
  if (!startAt) return true;
  const cutoff = new Date(startAt.getTime() + graceMinutes * 60 * 1000);
  return Date.now() < cutoff.getTime();
};

const renderProfilePage = () => {
  if (!isCurrentPage("profile.html")) return;
  const user = getCurrentUser();
  if (!user) return;

  const img = byId("profileImage");
  const name = byId("profileName");
  const username = byId("profileUsername");
  const meta = byId("profileMeta");
  if (img) img.src = user.profileImage || "image/IconLab.png";
  if (name) name.textContent = user.name || "-";
  if (username) username.textContent = `${user.username || "-"} | ${user.email || "-"}`;
  if (meta) {
    meta.innerHTML = `
      <p>${t("profileStudentId")}: ${user.studentId || "-"}</p>
      <p>${t("profileYear")}: ${user.year || "-"}</p>
      <p>${t("profileSchool")}: ${user.school || "-"}</p>
      <p>${t("profileMajor")}: ${user.major || "-"}</p>
      <p>${t("profilePhone")}: ${user.phone || "-"}</p>
    `;
  }

  const isMine = (b) =>
    (b.username && b.username === user.username) ||
    (b.email && b.email === user.email) ||
    (b.name && b.name === user.name) ||
    (b.requesterName && b.requesterName === user.name);

  const roomList = load(storageKeys.roomBookings, [])
    .filter(isMine)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  const eqList = load(storageKeys.equipmentBookings, [])
    .filter(isMine)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  const roomCount = byId("profileRoomCount");
  const eqCount = byId("profileEquipmentCount");
  const todayRoomCountNode = byId("profileTodayRoomCountValue");
  const weekRoomCountNode = byId("profileWeekRoomCountValue");
  const weekQuotaLeftNode = byId("profileWeekQuotaLeftValue");
  if (roomCount) roomCount.textContent = String(roomList.length);
  if (eqCount) eqCount.textContent = String(eqList.length);

  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const currentWeek = weekKey(today);
  const quota = getRoomQuota(user);
  const quotaSource = roomList.filter((b) => (b.status || "pending") !== "rejected");
  const todayRoomCount = quotaSource.filter((b) => String(b.date || "") === today).length;
  const weekRoomCount = quotaSource.filter((b) => weekKey(String(b.date || "")) === currentWeek).length;
  const weekQuotaLeft = Math.max(quota.weekly - weekRoomCount, 0);
  if (todayRoomCountNode) todayRoomCountNode.textContent = String(todayRoomCount);
  if (weekRoomCountNode) weekRoomCountNode.textContent = String(weekRoomCount);
  if (weekQuotaLeftNode) weekQuotaLeftNode.textContent = String(weekQuotaLeft);

  const roomWrap = byId("profileRoomList");
  if (roomWrap) {
    roomWrap.innerHTML = roomList.length
      ? roomList
          .map(
            (r) => `<div class="feed-item">
              <p class="feed-meta">${new Date(r.createdAt).toLocaleString(localeByLang())}</p>
              <p><strong>${r.room}</strong> | ${r.date} | ${r.timeSlot}</p>
              <p class="muted">${t("profilePurpose")}: ${r.purpose || "-"}</p>
              <p class="muted">${t("profileStatus")}: <span class="pill ${statusClass(r.status || "pending")}">${statusLabel(r.status || "pending")}</span></p>
              ${
                ["pending", "approved"].includes(r.status || "pending") && canCancelBookingWithinWindow(r)
                  ? `<div class="feed-actions-end"><button type="button" class="btn-small danger" data-cancel-room-booking="${r.bookingId || r.createdAt}">${t("cancelRoomBookingBtn")}</button></div>`
                  : ""
              }
            </div>`
          )
          .join("")
      : `<p class="muted">${t("profileNoRoomBookings")}</p>`;

    roomWrap.onclick = (ev) => {
      const target = ev.target;
      if (!(target instanceof HTMLElement)) return;
      const bookingId = target.dataset.cancelRoomBooking;
      if (!bookingId) return;
      const selected = roomList.find((b) => String(b.bookingId || b.createdAt) === String(bookingId));
      if (!selected || !canCancelBookingWithinWindow(selected)) return;
      if (!window.confirm(t("confirmCancelRoomBooking"))) return;
      const rooms = load(storageKeys.roomBookings, []);
      const next = rooms.filter((b) => String(b.bookingId || b.createdAt) !== String(bookingId));
      save(storageKeys.roomBookings, next);
      alert(t("cancelSuccess"));
      renderProfilePage();
      renderDashboard();
      renderRoomSlots();
      renderRoomApproval();
    };
  }

  const eqWrap = byId("profileEquipmentList");
  if (eqWrap) {
    const grouped = [];
    const batchMap = new Map();
    eqList.forEach((e) => {
      const status = e.returnStatus || "borrowed";
      const rawBatchId = String(e.returnBatchId || "").trim();
      const legacyBatchId =
        !rawBatchId && status !== "borrowed" && e.returnProofImage && e.returnProofAt
          ? `legacy-${status}-${e.returnProofAt}-${e.returnProofImage.slice(0, 64)}`
          : "";
      const batchId = rawBatchId || legacyBatchId;
      if (!batchId || status === "borrowed") {
        grouped.push({ type: "single", item: e });
        return;
      }
      if (!batchMap.has(batchId)) {
        batchMap.set(batchId, { type: "batch", batchId, items: [e] });
        grouped.push(batchMap.get(batchId));
      } else {
        batchMap.get(batchId).items.push(e);
      }
    });

    eqWrap.innerHTML = grouped.length
      ? grouped
          .map((entry) => {
            if (entry.type === "single") {
              const e = entry.item;
              return `<div class="feed-item">
                <p class="feed-meta">${new Date(e.createdAt).toLocaleString(localeByLang())}</p>
                <p><strong>${e.item}</strong> ${t("profileQty")} ${e.quantity}</p>
                <p class="muted">${t("profileStatus")}: <span class="pill ${e.returnStatus === "returned" ? "approved" : e.returnStatus === "return_requested" ? "pending" : ""}">${equipmentReturnStatusLabel(e.returnStatus || "borrowed")}</span></p>
                <p class="muted">${t("profileUsageDate")}: ${e.date}</p>
                <p class="muted">${t("profileDetail")}: ${e.detail || "-"}</p>
                ${
                  e.returnProofImage
                    ? `<p class="muted">${t("equipmentReturnProofLabel")}:</p><img class="return-proof-thumb" src="${e.returnProofImage}" alt="return-proof" />`
                    : ""
                }
                ${
                  (e.returnStatus || "borrowed") === "borrowed"
                    ? `<div class="feed-actions-end inline-actions">
                        <button type="button" class="btn-small" data-request-return="${e.bookingId || ""}">${t("equipmentRequestReturnBtn")}</button>
                        ${
                          canCancelBookingWithinWindow(e)
                            ? `<button type="button" class="btn-small danger" data-cancel-equipment-booking="${e.bookingId || e.createdAt}">${t("cancelEquipmentBookingBtn")}</button>`
                            : ""
                        }
                      </div>`
                    : (e.returnStatus || "borrowed") === "return_requested"
                      ? `<div class="feed-actions-end inline-actions">
                          <button type="button" class="btn-small danger" data-cancel-return-request="${e.bookingId || ""}">${t("cancelReturnRequestBtn")}</button>
                          ${
                            canCancelBookingWithinWindow(e)
                              ? `<button type="button" class="btn-small danger" data-cancel-equipment-booking="${e.bookingId || e.createdAt}">${t("cancelEquipmentBookingBtn")}</button>`
                              : ""
                          }
                        </div>`
                      : ""
                }
              </div>`;
            }

            const first = entry.items[0];
            const status = first.returnStatus || "borrowed";
            const totalQty = entry.items.reduce((sum, it) => sum + Math.max(1, Number(it.quantity || 1)), 0);
            const itemList = entry.items
              .map((it) => `<li><strong>${it.item}</strong> ${t("profileQty")} ${it.quantity}</li>`)
              .join("");
            return `<div class="feed-item">
              <p class="feed-meta">${new Date(first.createdAt).toLocaleString(localeByLang())}</p>
              <p><strong>${entry.items.length}</strong> ${t("equipmentBatchItemsLabel")} | ${t("profileQty")} ${t("equipmentTotalQtyLabel")} ${totalQty}</p>
              <ul class="list">${itemList}</ul>
              <p class="muted">${t("profileStatus")}: <span class="pill ${status === "returned" ? "approved" : status === "return_requested" ? "pending" : ""}">${equipmentReturnStatusLabel(status)}</span></p>
              <p class="muted">${t("profileUsageDate")}: ${first.date}</p>
              <p class="muted">${t("profileDetail")}: ${first.detail || "-"}</p>
              ${
                first.returnProofImage
                  ? `<p class="muted">${t("equipmentReturnProofLabel")}:</p><img class="return-proof-thumb" src="${first.returnProofImage}" alt="return-proof" />`
                  : ""
              }
              ${
                status === "return_requested"
                  ? `<div class="feed-actions-end inline-actions">
                      <button type="button" class="btn-small danger" data-cancel-return-batch="${entry.batchId}">${t("cancelReturnRequestBtn")}</button>
                    </div>`
                  : ""
              }
            </div>`;
          })
          .join("")
      : `<p class="muted">${t("profileNoEquipmentBookings")}</p>`;

    eqWrap.onclick = async (ev) => {
      const target = ev.target;
      if (!(target instanceof HTMLElement)) return;
      const cancelEquipmentId = target.dataset.cancelEquipmentBooking;
      if (cancelEquipmentId) {
        const selected = eqList.find((b) => String(b.bookingId || b.createdAt) === String(cancelEquipmentId));
        if (!selected || !canCancelBookingWithinWindow(selected)) return;
        if (!window.confirm(t("confirmCancelEquipmentBooking"))) return;
        const list = load(storageKeys.equipmentBookings, []);
        const next = list.filter(
          (b) => String(b.bookingId || b.createdAt) !== String(cancelEquipmentId)
        );
        save(storageKeys.equipmentBookings, next);
        alert(t("cancelSuccess"));
        renderProfilePage();
        renderDashboard();
        renderEquipmentCatalog();
        renderAdminEquipmentBorrowSummary();
        renderAdminUserProfilePanel();
        return;
      }
      const cancelReturnId = target.dataset.cancelReturnRequest;
      if (cancelReturnId) {
        if (!window.confirm(t("confirmCancelReturnRequest"))) return;
        const list = load(storageKeys.equipmentBookings, []);
        const idx = list.findIndex((b) => String(b.bookingId || b.createdAt) === String(cancelReturnId));
        if (idx >= 0) {
          list[idx].returnStatus = "borrowed";
          delete list[idx].returnRequestedAt;
          save(storageKeys.equipmentBookings, list);
        }
        alert(t("cancelSuccess"));
        renderProfilePage();
        renderDashboard();
        renderEquipmentCatalog();
        return;
      }
      const cancelReturnBatch = target.dataset.cancelReturnBatch;
      if (cancelReturnBatch) {
        if (!window.confirm(t("confirmCancelReturnRequest"))) return;
        const list = load(storageKeys.equipmentBookings, []);
        let changed = false;
        list.forEach((b) => {
          if (String(b.returnBatchId || "") !== String(cancelReturnBatch)) return;
          if ((b.returnStatus || "borrowed") !== "return_requested") return;
          b.returnStatus = "borrowed";
          delete b.returnRequestedAt;
          changed = true;
        });
        if (changed) {
          save(storageKeys.equipmentBookings, list);
          alert(t("cancelSuccess"));
        }
        renderProfilePage();
        renderDashboard();
        renderEquipmentCatalog();
        return;
      }
      const id = target.dataset.requestReturn;
      if (!id) return;
      await requestEquipmentReturn(id, { askProofInModal: true });
    };
  }
};

const roomSelection = () => ({
  room: byId("roomFixed")?.value?.trim() || "Lab-F11",
  date: byId("roomStatusDate")?.value?.trim() || byId("roomDate")?.value?.trim() || "",
  timeSlot: byId("roomStatusTime")?.value?.trim() || byId("roomTime")?.value?.trim() || "",
});

const roomBookingsBySelection = (selection) =>
  load(storageKeys.roomBookings, []).filter(
    (b) =>
      b.room === selection.room &&
      b.date === selection.date &&
      b.timeSlot === selection.timeSlot
  );

let currentRoomSlotEntries = [];

const isMyRoomBooking = (booking) => {
  const me = getCurrentUser();
  if (!me) return false;
  if (booking.username && booking.username === me.username) return true;
  if (booking.email && booking.email === me.email) return true;
  return Boolean(booking.name && booking.name === me.name);
};

const isBookingOwnedByUser = (booking, user) => {
  if (!user) return false;
  if (booking.username && booking.username === user.username) return true;
  if (booking.email && booking.email === user.email) return true;
  return Boolean((booking.requesterName || booking.name) && (booking.requesterName || booking.name) === user.name);
};

const weekKey = (dateStr) => {
  const date = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "";
  const day = (date.getDay() + 6) % 7; // Monday = 0
  date.setDate(date.getDate() - day);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const renderRoomSlots = () => {
  const grid = byId("roomSlotsGrid");
  const summary = byId("roomSlotSummary");
  const detail = byId("roomSlotDetail");
  const dailySummary = byId("roomDailySummary");
  if (!grid) return;

  const selection = roomSelection();
  if (!selection.date || !selection.timeSlot) {
    if (summary) summary.textContent = t("roomSelectHint");
    if (dailySummary) dailySummary.textContent = t("roomDailyHint");
    if (detail) detail.textContent = t("roomHoverHint");
    currentRoomSlotEntries = [];
    grid.innerHTML = Array.from({ length: 20 })
      .map(
        (_, i) =>
          `<div class="room-slot" title="${t("roomSlotTitle", { index: i + 1 })}"><img src="image/userG.png" alt="empty" /></div>`
      )
      .join("");
    return;
  }

  const bookings = roomBookingsBySelection(selection).filter((b) => b.status === "approved");
  const pendingCount = roomBookingsBySelection(selection).filter((b) => b.status !== "approved").length;
  const dayBookings = load(storageKeys.roomBookings, []).filter(
    (b) => b.room === selection.room && b.date === selection.date
  );
  const approvedPerDay = dayBookings
    .filter((b) => b.status === "approved")
    .reduce((sum, b) => sum + Number(b.participantCount || 1), 0);
  const pendingPerDay = dayBookings
    .filter((b) => b.status === "pending")
    .reduce((sum, b) => sum + Number(b.participantCount || 1), 0);
  const dayCapacity = 40;
  const availablePerDay = Math.max(dayCapacity - approvedPerDay, 0);
  const slots = [];
  bookings.forEach((b) => {
    const n = Number(b.participantCount || 1);
    for (let i = 0; i < n; i += 1) {
      slots.push({ mine: isMyRoomBooking(b), booking: b });
      if (slots.length >= 20) break;
    }
  });
  currentRoomSlotEntries = slots;
  if (summary) {
    summary.textContent = t("roomSummaryText", {
      room: selection.room,
      date: selection.date,
      timeSlot: selection.timeSlot,
      approved: slots.length,
      pending: pendingCount,
    });
  }
  if (dailySummary) {
    dailySummary.textContent = t("roomDailySummaryText", {
      date: selection.date,
      booked: approvedPerDay,
      available: availablePerDay,
      pending: pendingPerDay,
    });
  }
  if (detail) detail.textContent = t("roomHoverHint");

  let html = "";
  for (let i = 0; i < 20; i += 1) {
    if (i >= slots.length) {
      html += `<div class="room-slot" data-slot-index="${i}" title="${t("roomSlotEmpty", { index: i + 1 })}"><img src="image/userG.png" alt="empty" /></div>`;
      continue;
    }
    const mine = slots[i].mine;
    const b = slots[i].booking;
    const icon = mine ? "image/userGre.png" : "image/userR.png";
    const owner = b.requesterName || b.name || "-";
    const title = mine
      ? t("roomSlotMineTitle", { index: i + 1, owner })
      : t("roomSlotOtherTitle", { index: i + 1, owner });
    html += `<div class="room-slot" data-slot-index="${i}" title="${title}"><img src="${icon}" alt="${mine ? "mine" : "other"}" /></div>`;
  }
  grid.innerHTML = html;
};

const setupRoomBookingUI = () => {
  const form = byId("roomBookingForm");
  const today = new Date().toISOString().slice(0, 10);
  const syncInputValue = (fromId, toId) => {
    const from = byId(fromId);
    const to = byId(toId);
    if (!from || !to) return;
    to.value = from.value;
  };

  byId("roomStatusDate")?.addEventListener("change", () => {
    syncInputValue("roomStatusDate", "roomDate");
    renderRoomSlots();
  });
  byId("roomStatusTime")?.addEventListener("change", () => {
    syncInputValue("roomStatusTime", "roomTime");
    renderRoomSlots();
  });
  byId("roomDate")?.addEventListener("change", () => {
    syncInputValue("roomDate", "roomStatusDate");
    renderRoomSlots();
  });
  byId("roomTime")?.addEventListener("change", () => {
    syncInputValue("roomTime", "roomStatusTime");
    renderRoomSlots();
  });

  if (!form) {
    const statusDate = byId("roomStatusDate");
    if (statusDate && !statusDate.value) statusDate.value = today;
    renderRoomSlots();
    return;
  }

  const me = getCurrentUser();
  const nameInput = byId("roomRequesterName");
  if (nameInput && me && !nameInput.value) {
    nameInput.value = me.name || me.username;
  }
  const roomDate = byId("roomDate");
  const roomStatusDate = byId("roomStatusDate");
  if (roomDate && !roomDate.value) roomDate.value = today;
  if (roomStatusDate && !roomStatusDate.value) roomStatusDate.value = roomDate?.value || today;
  if (roomDate && roomStatusDate && roomDate.value !== roomStatusDate.value) {
    roomDate.value = roomStatusDate.value;
  }
  if (byId("roomTime") && byId("roomStatusTime") && !byId("roomStatusTime").value) {
    syncInputValue("roomTime", "roomStatusTime");
  }

  byId("roomSlotsGrid")?.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    const slotEl = target.closest("[data-slot-index]");
    if (!(slotEl instanceof HTMLElement)) return;
    const index = Number(slotEl.dataset.slotIndex);
    const detail = byId("roomSlotDetail");
    if (!detail) return;
    const entry = currentRoomSlotEntries[index];
    if (!entry) {
      detail.textContent = t("roomSlotEmptyDetail", { index: index + 1 });
      return;
    }
    const b = entry.booking;
    detail.innerHTML = t("roomSlotDetailFull", {
      index: index + 1,
      requester: b.requesterName || b.name || "-",
      member1: b.member1 || "-",
      member2: b.member2 || "-",
      purpose: b.purpose || "-",
      date: b.date || "-",
      timeSlot: b.timeSlot || "-",
      status: b.status || "-",
    });
  });

  setupResponsibleSelector();
  renderRoomSlots();
};

const setupEquipmentRulesPopup = () => {
  if (!isCurrentPage("equipment.html")) return;
  const modal = byId("equipmentRulesModal");
  const acceptBtn = byId("equipmentRulesAcceptBtn");
  if (!modal || !acceptBtn) return;

  const user = getCurrentUser();
  const session = getSession();
  const getSeenKey = () => {
    if (user) {
      const stamp = session?.loginAt || "legacy";
      return `eq_rules_seen_${user.username || user.email || "user"}_${stamp}`;
    }
    return "eq_rules_seen_guest";
  };

  if (!acceptBtn.dataset.bound) {
    acceptBtn.dataset.bound = "1";
    acceptBtn.addEventListener("click", () => {
      sessionStorage.setItem(getSeenKey(), "1");
      modal.hidden = true;
      document.body.classList.remove("no-scroll");
    });
  }

  const seen = sessionStorage.getItem(getSeenKey()) === "1";
  modal.hidden = seen;
  document.body.classList.toggle("no-scroll", !seen);
};

const setupRoomRulesPopup = () => {
  if (!isCurrentPage("rooms.html")) return;
  const modal = byId("roomRulesModal");
  const acceptBtn = byId("roomRulesAcceptBtn");
  if (!modal || !acceptBtn) return;

  const user = getCurrentUser();
  const session = getSession();
  const getSeenKey = () => {
    if (user) {
      const stamp = session?.loginAt || "legacy";
      return `room_rules_seen_${user.username || user.email || "user"}_${stamp}`;
    }
    return "room_rules_seen_guest";
  };

  if (!acceptBtn.dataset.bound) {
    acceptBtn.dataset.bound = "1";
    acceptBtn.addEventListener("click", () => {
      sessionStorage.setItem(getSeenKey(), "1");
      modal.hidden = true;
      document.body.classList.remove("no-scroll");
    });
  }

  const seen = sessionStorage.getItem(getSeenKey()) === "1";
  modal.hidden = seen;
  document.body.classList.toggle("no-scroll", !seen);
};

const updateBookingAuthUI = () => {
  const loggedIn = Boolean(getCurrentUser());
  const roomForm = byId("roomBookingForm");
  const roomCard = byId("roomBookingCard");
  const roomMainGrid = byId("roomMainGrid");
  const roomLegendMine = byId("roomLegendMine");
  const eqForm = byId("equipmentBookingForm");
  const eqCard = byId("equipmentBookingCard");
  const eqMainGrid = byId("equipmentMainGrid");
  const eqReturnAllBtn = byId("eqReturnAllBtn");
  const eqFilter = byId("eqListFilter");
  const roomHint = byId("roomAuthHint");
  const eqHint = byId("equipmentAuthHint");

  if (roomForm) {
    if (roomCard) roomCard.hidden = !loggedIn;
    if (roomMainGrid) roomMainGrid.classList.toggle("single-col", !loggedIn);
    if (roomLegendMine) roomLegendMine.hidden = !loggedIn;
    const submit = roomForm.querySelector('button[type="submit"]');
    if (submit) submit.disabled = !loggedIn;
    if (roomHint) roomHint.textContent = loggedIn ? "" : t("loginRequiredToBook");
    setupRoomRulesPopup();
  }
  if (eqForm) {
    if (eqCard) eqCard.hidden = !loggedIn;
    if (eqMainGrid) eqMainGrid.classList.toggle("single-col", !loggedIn);
    const submit = eqForm.querySelector('button[type="submit"]');
    if (submit) submit.disabled = !loggedIn;
    if (eqHint) eqHint.textContent = loggedIn ? "" : t("loginRequiredToBook");
    const disabled = !loggedIn;
    const ids = ["eqName", "eqDate", "eqTime", "eqDetail"];
    ids.forEach((id) => {
      const el = byId(id);
      if (el) el.disabled = disabled;
    });
    if (disabled) {
      const responsibleWrap = byId("eqResponsibleOptions");
      if (responsibleWrap) responsibleWrap.innerHTML = `<p class="muted">${t("loginRequiredToBook")}</p>`;
      if (eqFilter) eqFilter.value = "all";
      if (eqReturnAllBtn) eqReturnAllBtn.hidden = true;
    } else {
      const me = getCurrentUser();
      const eqName = byId("eqName");
      if (eqName && !eqName.value) eqName.value = me?.username || me?.name || me?.email || "";
      renderEqResponsibleOptions();
      syncEquipmentEligibility();
    }
    renderEquipmentCatalog();
    setupEquipmentRulesPopup();
  }
};

const setupHomeBottomEditor = () => {
  const tools = byId("labBottomAdminTools");
  const form = byId("labBottomForm");
  const toggleBtn = byId("toggleLabEditBtn");
  if (!tools || !form || !toggleBtn) return;

  if (!isAdminSession()) {
    tools.hidden = true;
    return;
  }

  tools.hidden = false;
  const info = { ...defaultHomeInfo, ...load(storageKeys.homeInfo, defaultHomeInfo) };
  byId("labFormOrgName").value = info.orgName || "";
  byId("labFormAddress").value = info.address || "";
  byId("labFormFacebook").value = info.contactFacebook || "";
  byId("labFormInstagram").value = info.contactInstagram || "";
  byId("labFormPhone").value = info.contactPhone || "";
  byId("labFormUnits").value = Array.isArray(info.units) ? info.units.join("\n") : "";
  byId("labFormMapUrl").value = info.mapUrl || "";
  byId("labFormManagerName").value = info.managerName || "";
  byId("labFormManagerRole").value = info.managerRole || "";
  const showManagerInput = byId("labFormShowManager");
  if (showManagerInput) showManagerInput.checked = info.managerVisible !== false;

  toggleBtn.addEventListener("click", () => {
    if (!requireAdminAction()) return;
    form.hidden = !form.hidden;
    toggleBtn.textContent = form.hidden ? t("toggleShowEdit") : t("toggleHideEdit");
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!requireAdminAction()) return;
    let uploadedImage = "";
    const imageFile = byId("labFormManagerImageFile")?.files?.[0];
    if (imageFile) {
      try {
        uploadedImage = await fileToDataUrl(imageFile);
      } catch {
        uploadedImage = "";
      }
    }
    const next = {
      orgName: byId("labFormOrgName").value.trim(),
      address: byId("labFormAddress").value.trim(),
      contactFacebook: byId("labFormFacebook").value.trim(),
      contactInstagram: byId("labFormInstagram").value.trim(),
      contactPhone: byId("labFormPhone").value.trim(),
      units: byId("labFormUnits")
        .value.split("\n")
        .map((v) => v.trim())
        .filter(Boolean),
      mapUrl: byId("labFormMapUrl").value.trim(),
      managerName: byId("labFormManagerName").value.trim(),
      managerRole: byId("labFormManagerRole").value.trim(),
      managerVisible: byId("labFormShowManager")?.checked !== false,
      managerImage:
        uploadedImage ||
        info.managerImage ||
        "image/IconLab.png",
    };
    save(storageKeys.homeInfo, { ...defaultHomeInfo, ...next });
    renderHomeBottomInfo();
    setNotice(byId("labBottomNotice"), t("labSaveOk"));
    const fileField = byId("labFormManagerImageFile");
    if (fileField) fileField.value = "";
    form.hidden = true;
    toggleBtn.textContent = t("toggleShowEdit");
  });
};

const getResponsibleStaff = () => load(storageKeys.responsibleStaff, defaultResponsibleStaff);

const renderResponsibleOptions = () => {
  const box = byId("responsibleOptions");
  if (!box) return;
  const selected = byId("selectedResponsibleId")?.value || "";
  const list = getResponsibleStaff();
  box.innerHTML = list.length
    ? list
        .map(
          (s) => `<div class="responsible-card ${selected === s.id ? "active" : ""}" data-responsible-id="${s.id}">
            <img src="${s.image || "image/IconLab.png"}" alt="${s.name}" />
            <div>
              <p class="responsible-name">${s.name}</p>
              <p class="responsible-email">${s.email}</p>
            </div>
          </div>`
        )
        .join("")
    : `<p class="muted">${t("noResponsibleOptions")}</p>`;
};

const setupResponsibleSelector = () => {
  const box = byId("responsibleOptions");
  const hidden = byId("selectedResponsibleId");
  if (!box || !hidden) return;

  if (!hidden.value) {
    const first = getResponsibleStaff()[0];
    hidden.value = first?.id || "";
  }
renderResponsibleOptions();
renderEqResponsibleOptions();

  box.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    const card = target.closest("[data-responsible-id]");
    if (!(card instanceof HTMLElement)) return;
    hidden.value = card.dataset.responsibleId || "";
    renderResponsibleOptions();
    renderEqResponsibleOptions();
  });
};

const getEquipmentItems = () => load(storageKeys.equipmentItems, defaultEquipmentItems);
const getEquipmentTypes = () => load(storageKeys.equipmentTypes, defaultEquipmentTypes);
const normalizeEquipmentTypes = () => {
  const list = [...new Set(getEquipmentTypes().map((v) => String(v || "").trim()).filter(Boolean))];
  return list.length ? list : [...defaultEquipmentTypes];
};
const normalizeEquipmentItems = () =>
  getEquipmentItems().map((it, idx) => ({
    id: it.id || `eq-${idx + 1}`,
    name: it.name || `Item ${idx + 1}`,
    image: it.image || "image/IconLab.png",
    stock: Math.max(1, Number(it.stock || 1)),
    type: it.type || "ทั่วไป",
  }));

const renderEquipmentTypeFilterOptions = () => {
  const select = byId("eqTypeFilter");
  if (!select) return;
  const current = select.value || "all";
  const types = normalizeEquipmentTypes();
  select.innerHTML =
    `<option value="all">${t("equipmentTypeAllFilter")}</option>` +
    types.map((type) => `<option value="${type}">${type}</option>`).join("");
  if (current !== "all" && types.includes(current)) {
    select.value = current;
  } else {
    select.value = "all";
  }
};

const refreshEquipmentFilterLabels = () => {
  const availableOpt = byId("eqListFilter")?.querySelector('option[value="available"]');
  if (availableOpt) availableOpt.textContent = t("equipmentFilterAvailable");
};

const getBorrowedQtyByItemId = (itemId) => {
  const item = normalizeEquipmentItems().find((x) => x.id === itemId);
  return load(storageKeys.equipmentBookings, [])
    .filter((b) => b.itemId === itemId || (!b.itemId && item && b.item === item.name))
    .filter((b) => (b.returnStatus || "borrowed") !== "returned")
    .reduce((sum, b) => sum + Math.max(1, Number(b.quantity || 1)), 0);
};

const getAvailableQtyByItemId = (itemId) => {
  const item = normalizeEquipmentItems().find((x) => x.id === itemId);
  if (!item) return 0;
  return Math.max(item.stock - getBorrowedQtyByItemId(itemId), 0);
};

const buildEquipmentBorrowStats = (items, bookings) => {
  const byId = new Map();
  const idByName = new Map(items.map((it) => [String(it.name || ""), String(it.id || "")]));
  bookings.forEach((b) => {
    if ((b.returnStatus || "borrowed") === "returned") return;
    const bookingItemId = String(b.itemId || "");
    const resolvedId = bookingItemId || idByName.get(String(b.item || "")) || "";
    if (!resolvedId) return;
    const qty = Math.max(1, Number(b.quantity || 1));
    byId.set(resolvedId, (byId.get(resolvedId) || 0) + qty);
  });
  return byId;
};

const getMyActiveEquipmentBookings = (user) =>
  load(storageKeys.equipmentBookings, [])
    .filter((b) => isBookingOwnedByUser(b, user))
    .filter((b) => (b.returnStatus || "borrowed") !== "returned")
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

const renderSelectedEquipmentList = () => {
  const wrap = byId("eqSelectedItemsList");
  const hidden = byId("eqItemsJson");
  const clearBtn = byId("eqClearSelectionBtn");
  if (!wrap || !hidden) return;
  hidden.value = JSON.stringify(selectedEquipmentEntries);
  if (clearBtn) clearBtn.disabled = selectedEquipmentEntries.length === 0;
  if (!selectedEquipmentEntries.length) {
    wrap.innerHTML = `<p class="muted">${t("equipmentSelectedListEmpty")}</p>`;
    return;
  }
  wrap.innerHTML = selectedEquipmentEntries
    .map(
      (entry, index) => `<div class="admin-item">
      <div>
        <p><strong>${entry.name}</strong></p>
        <p class="muted">${t("quantityLabel")}: <input type="number" min="1" value="${entry.quantity}" data-eq-selected-qty="${index}" style="width:84px;" /></p>
      </div>
      <div class="feed-actions-end inline-actions">
        <button type="button" class="btn-small danger" data-eq-remove-selected="${index}">${t("deleteBtn")}</button>
      </div>
    </div>`
    )
    .join("");
};

let selectedEquipmentItemId = "";
let equipmentReturnSubmitting = false;
let selectedEquipmentEntries = [];

const renderEquipmentCatalog = () => {
  const grid = byId("eqCatalogGrid");
  const filter = byId("eqListFilter");
  const typeFilter = byId("eqTypeFilter");
  const hint = byId("eqListHint");
  const returnAllBtn = byId("eqReturnAllBtn");
  if (!grid || !filter) return;

  const me = getCurrentUser();
  let mode = filter.value || "all";
  const selectedType = typeFilter?.value || "all";
  const items = normalizeEquipmentItems();
  const allBookings = load(storageKeys.equipmentBookings, []);
  const borrowedById = buildEquipmentBorrowStats(items, allBookings);
  const canBook = Boolean(byId("eqTime")?.value);

  if (mode === "all" || mode === "available") {
    equipmentReturnSubmitting = false;
    if (returnAllBtn) returnAllBtn.hidden = true;
    grid.innerHTML = items
      .filter((item) => selectedType === "all" || (item.type || "ทั่วไป") === selectedType)
      .filter((item) => {
        if (mode !== "available") return true;
        const borrowed = borrowedById.get(item.id) || 0;
        const available = Math.max(Number(item.stock || 0) - borrowed, 0);
        return available > 0;
      })
      .map((item) => {
        const borrowed = borrowedById.get(item.id) || 0;
        const available = Math.max(Number(item.stock || 0) - borrowed, 0);
        const exhausted = available <= 0;
        const active =
          selectedEquipmentItemId === item.id ||
          selectedEquipmentEntries.some((entry) => entry.itemId === item.id);
        return `<div class="equipment-card ${exhausted ? "exhausted" : ""} ${active ? "active" : ""}" data-eq-item-id="${item.id}">
          <img src="${item.image}" alt="${item.name}" />
          <p><strong>${item.name}</strong></p>
          <p class="muted">${t("equipmentTypeLabel")}: ${item.type || "ทั่วไป"}</p>
          <p class="muted">${t("equipmentBookedLabel")}: ${borrowed}</p>
          <p class="muted">${exhausted ? t("equipmentEmptyLabel") : t("equipmentLeftLabel", { available, stock: item.stock })}</p>
        </div>`;
      })
      .join("");
    if (hint) {
      hint.textContent = canBook ? t("equipmentPickHint") : t("equipmentNeedTime");
    }
    if (returnAllBtn) returnAllBtn.disabled = true;
    return;
  }

  selectedEquipmentItemId = "";
  if (!me) {
    if (returnAllBtn) returnAllBtn.hidden = true;
    const active = load(storageKeys.equipmentBookings, [])
      .filter((b) => (b.returnStatus || "borrowed") !== "returned")
      .filter((b) => {
        const item = items.find((x) => x.id === b.itemId || (!b.itemId && x.name === b.item));
        const itemType = item?.type || "ทั่วไป";
        return selectedType === "all" || itemType === selectedType;
      });
    const grouped = new Map();
    active.forEach((b) => {
      const key = b.itemId || b.item || "-";
      const current = grouped.get(key) || {
        item: b.item || "-",
        itemId: b.itemId || "",
        quantity: 0,
        latestDate: b.date || "",
      };
      current.quantity += Math.max(1, Number(b.quantity || 1));
      current.latestDate = b.date || current.latestDate;
      grouped.set(key, current);
    });
    const rows = [...grouped.values()];
    grid.innerHTML = rows.length
      ? rows
          .map((r) => {
            const item = items.find((x) => x.id === r.itemId || x.name === r.item);
            return `<div class="equipment-card">
              <img src="${item?.image || "image/IconLab.png"}" alt="${r.item}" />
              <p><strong>${r.item}</strong></p>
              <p class="muted">${t("equipmentBookedLabel")}: ${r.quantity}</p>
              <p class="muted">${t("profileUsageDate")}: ${r.latestDate || "-"}</p>
            </div>`;
          })
          .join("")
      : `<p class="muted">${t("equipmentBookedEmpty")}</p>`;
    if (hint) hint.textContent = "";
    return;
  }

  if (returnAllBtn) returnAllBtn.hidden = false;
  const bookings = getMyActiveEquipmentBookings(me).filter((b) => {
    const item = items.find((x) => x.id === b.itemId || (!b.itemId && x.name === b.item));
    const itemType = item?.type || "ทั่วไป";
    return selectedType === "all" || itemType === selectedType;
  });
  grid.innerHTML = bookings.length
    ? bookings
        .map((b) => {
          const item = items.find((x) => x.id === b.itemId);
          return `<div class="equipment-card">
            <img src="${item?.image || "image/IconLab.png"}" alt="${b.item}" />
            <p><strong>${b.item}</strong> x ${b.quantity}</p>
            <p class="muted">${b.date} | ${b.timeSlot || "-"}</p>
            <p class="muted">สถานะ: ${equipmentReturnStatusLabel(b.returnStatus || "borrowed")}</p>
            ${
              b.returnProofImage
                ? `<p class="muted">${t("equipmentReturnProofLabel")}</p><img class="return-proof-thumb" src="${b.returnProofImage}" alt="return-proof" />`
                : ""
            }
          </div>`;
        })
        .join("")
    : `<p class="muted">${t("equipmentBookedEmpty")}</p>`;
  if (hint) hint.textContent = t("equipmentReturnHint");
  if (returnAllBtn) returnAllBtn.disabled = bookings.length === 0 || equipmentReturnSubmitting;
};

const renderEqResponsibleOptions = () => {
  const box = byId("eqResponsibleOptions");
  if (!box) return;
  const selected = byId("eqSelectedResponsibleId")?.value || "";
  const list = getResponsibleStaff();
  box.innerHTML = list.length
    ? list
        .map(
          (s) => `<div class="responsible-card ${selected === s.id ? "active" : ""}" data-eq-responsible-id="${s.id}">
            <img src="${s.image || "image/IconLab.png"}" alt="${s.name}" />
            <div>
              <p class="responsible-name">${s.name}</p>
              <p class="responsible-email">${s.email}</p>
            </div>
          </div>`
        )
        .join("")
    : `<p class="muted">${t("noResponsibleOptions")}</p>`;
};

const setupEqResponsibleSelector = () => {
  const box = byId("eqResponsibleOptions");
  const hidden = byId("eqSelectedResponsibleId");
  if (!box || !hidden) return;

  if (!hidden.value) {
    hidden.value = getResponsibleStaff()[0]?.id || "";
  }
  renderEqResponsibleOptions();

  box.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    const card = target.closest("[data-eq-responsible-id]");
    if (!(card instanceof HTMLElement)) return;
    hidden.value = card.dataset.eqResponsibleId || "";
    renderEqResponsibleOptions();
  });
};

const getMyApprovedRoomSlots = (user) => {
  if (!user) return [];
  return load(storageKeys.roomBookings, [])
    .filter((b) => b.status === "approved")
    .filter((b) => isBookingOwnedByUser(b, user))
    .map((b) => ({ date: b.date, timeSlot: b.timeSlot, room: b.room || "Lab-F11" }));
};

const syncEquipmentEligibility = () => {
  const eqDate = byId("eqDate");
  const eqTime = byId("eqTime");
  const eqDetail = byId("eqDetail");
  const selectedLabel = byId("eqSelectedItemLabel");
  const hint = byId("eqRoomRuleHint");
  const addBtn = byId("eqAddToSelectionBtn");
  const eqName = byId("eqName");
  if (!eqDate || !eqTime) return;

  const user = getCurrentUser();
  if (!user) {
    eqDate.disabled = true;
    eqTime.disabled = true;
    if (eqDetail) eqDetail.disabled = true;
    if (addBtn) addBtn.disabled = true;
    if (eqName) eqName.value = "";
    eqDate.innerHTML = `<option value="">${t("equipmentSelectDateFromRoom")}</option>`;
    eqTime.innerHTML = `<option value="">${t("selectTime")}</option>`;
    if (selectedLabel) selectedLabel.value = t("equipmentSelectDefault");
    selectedEquipmentItemId = "";
    selectedEquipmentEntries = [];
    renderSelectedEquipmentList();
    if (hint) hint.textContent = t("loginRequiredToBook");
    equipmentReturnSubmitting = false;
    renderEquipmentCatalog();
    return;
  }

  if (eqName) eqName.value = user.username || user.name || user.email || "";

  const slots = getMyApprovedRoomSlots(user);
  const dates = [...new Set(slots.map((s) => s.date).filter(Boolean))].sort();
  const prevDate = eqDate.value || "";
  eqDate.innerHTML =
    `<option value="">${t("equipmentSelectDateFromRoom")}</option>` +
    dates.map((d) => `<option value="${d}">${d}</option>`).join("");
  eqDate.value = dates.includes(prevDate) ? prevDate : dates[0] || "";
  eqDate.disabled = !dates.length;
  const date = eqDate.value || "";
  const times = [...new Set(slots.filter((s) => s.date === date).map((s) => s.timeSlot))];
  const prevTime = eqTime.value;
  eqTime.innerHTML =
    `<option value="">${t("selectTime")}</option>` +
    times.map((ts) => `<option value="${ts}">${ts}</option>`).join("");
  eqTime.value = times.includes(prevTime) ? prevTime : "";
  eqTime.disabled = !date || !times.length;

  const canPickEquipment = Boolean(eqTime.value);
  if (eqDetail) eqDetail.disabled = !canPickEquipment;
  if (addBtn) addBtn.disabled = !canPickEquipment;
  if (!canPickEquipment) {
    selectedEquipmentItemId = "";
    if (selectedLabel) selectedLabel.value = t("equipmentSelectDefault");
  }

  if (!date) {
    if (hint) hint.textContent = dates.length ? t("equipmentNeedDate") : t("equipmentNoMatchTime");
  } else if (!times.length) {
    if (hint) hint.textContent = t("equipmentNoMatchTime");
  } else if (!eqTime.value) {
    if (hint) hint.textContent = t("equipmentNeedTime");
  } else {
    if (hint) hint.textContent = "";
  }
  renderEquipmentCatalog();
};

const setupEquipmentBookingUI = () => {
  const form = byId("equipmentBookingForm");
  if (!form) return;
  const me = getCurrentUser();
  if (me && byId("eqName") && !byId("eqName").value) {
    byId("eqName").value = me.username || me.name || me.email || "";
  }
  selectedEquipmentEntries = [];
  renderSelectedEquipmentList();
  if (byId("eqSelectedItemLabel")) byId("eqSelectedItemLabel").value = t("equipmentSelectDefault");
  refreshEquipmentFilterLabels();
  renderEquipmentTypeFilterOptions();
  byId("eqListFilter")?.addEventListener("change", () => {
    renderEquipmentCatalog();
  });
  byId("eqTypeFilter")?.addEventListener("change", () => {
    renderEquipmentCatalog();
  });

  byId("eqCatalogGrid")?.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    const itemCard = target.closest("[data-eq-item-id]");

    if (itemCard instanceof HTMLElement) {
      const mode = byId("eqListFilter")?.value || "all";
      if (!(mode === "all" || mode === "available")) return;
      const itemId = itemCard.dataset.eqItemId || "";
      const available = getAvailableQtyByItemId(itemId);
      const canPickEquipment = Boolean(byId("eqTime")?.value);
      if (!canPickEquipment || available <= 0) return;
      const item = normalizeEquipmentItems().find((x) => x.id === itemId);
      selectedEquipmentItemId = itemId;
      byId("eqSelectedItemLabel").value = item ? `${item.name} (${t("equipmentLeftLabel", { available, stock: item.stock })})` : t("equipmentSelectDefault");
      renderEquipmentCatalog();
      return;
    }
  });

  byId("eqAddToSelectionBtn")?.addEventListener("click", () => {
    const notice = byId("equipmentNotice");
    if (!byId("eqDate")?.value) {
      setNotice(notice, t("equipmentNeedDate"), "error");
      return;
    }
    if (!byId("eqTime")?.value) {
      setNotice(notice, t("equipmentNeedTime"), "error");
      return;
    }
    if (!selectedEquipmentItemId) {
      setNotice(notice, t("equipmentSelectionNeedItem"), "error");
      return;
    }
    if (selectedEquipmentEntries.some((entry) => entry.itemId === selectedEquipmentItemId)) {
      setNotice(notice, t("equipmentSelectionDuplicate"), "error");
      return;
    }
    if (selectedEquipmentEntries.length >= 5) {
      setNotice(notice, t("equipmentSelectionMaxReached"), "error");
      return;
    }
    const item = normalizeEquipmentItems().find((x) => x.id === selectedEquipmentItemId);
    if (!item) return;
    const available = getAvailableQtyByItemId(item.id);
    if (available <= 0) {
      setNotice(notice, t("equipmentOutOfStock"), "error");
      return;
    }
    selectedEquipmentEntries.push({
      itemId: item.id,
      name: item.name,
      quantity: 1,
    });
    renderSelectedEquipmentList();
    renderEquipmentCatalog();
    setNotice(notice, t("equipmentSelectionAdded"));
  });

  byId("eqSelectedItemsList")?.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    const removeIndex = target.dataset.eqRemoveSelected;
    if (removeIndex === undefined) return;
    const index = Number(removeIndex);
    if (Number.isNaN(index) || index < 0 || index >= selectedEquipmentEntries.length) return;
    selectedEquipmentEntries.splice(index, 1);
    renderSelectedEquipmentList();
    renderEquipmentCatalog();
  });

  byId("eqSelectedItemsList")?.addEventListener("input", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLInputElement)) return;
    const idx = target.dataset.eqSelectedQty;
    if (idx === undefined) return;
    const index = Number(idx);
    if (Number.isNaN(index) || index < 0 || index >= selectedEquipmentEntries.length) return;
    const entry = selectedEquipmentEntries[index];
    const max = getAvailableQtyByItemId(entry.itemId) + entry.quantity;
    const qty = Math.max(1, Math.min(max, Number(target.value || 1)));
    entry.quantity = qty;
    target.value = String(qty);
    renderSelectedEquipmentList();
  });

  byId("eqClearSelectionBtn")?.addEventListener("click", () => {
    selectedEquipmentEntries = [];
    renderSelectedEquipmentList();
    renderEquipmentCatalog();
  });

  byId("eqReturnAllBtn")?.addEventListener("click", async () => {
    if (equipmentReturnSubmitting) return;
    const meUser = getCurrentUser();
    if (!meUser) return;
    const all = getMyActiveEquipmentBookings(meUser).map((b) => b.bookingId);
    if (!all.length) return;
    equipmentReturnSubmitting = true;
    renderEquipmentCatalog();
    await requestMultipleEquipmentReturns(all, { askProofInModal: true });
    equipmentReturnSubmitting = false;
    renderEquipmentCatalog();
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const notice = byId("equipmentNotice");
    const currentUser = getCurrentUser();
    if (!currentUser) {
      setNotice(notice, t("loginRequiredToBook"), "error");
      return;
    }
    const date = byId("eqDate")?.value || "";
    const timeSlot = byId("eqTime")?.value || "";
    const responsibleId = byId("eqSelectedResponsibleId")?.value || "";
    const detail = byId("eqDetail")?.value || "";
    if (!date || !timeSlot || !responsibleId || !selectedEquipmentEntries.length) {
      setNotice(notice, t("fillAll"), "error");
      return;
    }
    if (selectedEquipmentEntries.length > 5) {
      setNotice(notice, t("equipmentSelectionMaxReached"), "error");
      return;
    }
    const matched = load(storageKeys.roomBookings, [])
      .filter((b) => b.status === "approved")
      .filter((b) => isBookingOwnedByUser(b, currentUser))
      .some((b) => b.date === date && b.timeSlot === timeSlot);
    if (!matched) {
      setNotice(notice, t("equipmentNeedRoom"), "error");
      return;
    }
    for (const entry of selectedEquipmentEntries) {
      const available = getAvailableQtyByItemId(entry.itemId);
      const qty = Math.max(1, Number(entry.quantity || 1));
      if (available <= 0 || qty > available) {
        setNotice(notice, t("equipmentOutOfStock"), "error");
        return;
      }
    }
    const list = load(storageKeys.equipmentBookings);
    const bookerName = currentUser.username || currentUser.name || currentUser.email || "";
    const nowIso = new Date().toISOString();
    selectedEquipmentEntries.forEach((entry) => {
      list.push({
        bookingId: `eqb-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name: bookerName,
        username: currentUser.username || "",
        email: currentUser.email || "",
        item: entry.name,
        itemId: entry.itemId,
        quantity: Math.max(1, Number(entry.quantity || 1)),
        date,
        timeSlot,
        room: "Lab-F11",
        responsibleId,
        detail,
        createdAt: nowIso,
        returnStatus: "borrowed",
      });
    });
    save(storageKeys.equipmentBookings, list);
    setNotice(notice, t("bookingSaved"));
    form.reset();
    const hidden = byId("eqSelectedResponsibleId");
    if (hidden) hidden.value = getResponsibleStaff()[0]?.id || "";
    selectedEquipmentItemId = "";
    selectedEquipmentEntries = [];
    renderSelectedEquipmentList();
    syncEquipmentEligibility();
    renderDashboard();
    renderRoomApproval();
    renderRoomSlots();
    renderResponsibleOptions();
    renderEqResponsibleOptions();
    renderProfilePage();
    renderAdminUserProfilePanel();
  });

  setupEqResponsibleSelector();
  byId("eqDate")?.addEventListener("change", syncEquipmentEligibility);
  byId("eqTime")?.addEventListener("change", syncEquipmentEligibility);
  syncEquipmentEligibility();
};

const equipmentReturnStatusLabel = (status) => {
  if (status === "returned") return t("equipmentReturnStatusReturned");
  if (status === "return_requested") return t("equipmentReturnStatusRequested");
  return t("equipmentReturnStatusBorrowed");
};

const renderResponsibleAdminList = () => {
  const wrap = byId("responsibleList");
  if (!wrap) return;
  const list = getResponsibleStaff();
  wrap.classList.add("responsible-admin-list");
  wrap.innerHTML = list.length
    ? list
        .map(
          (s, i) => `<div class="admin-item">
            <div style="display:flex;gap:0.6rem;align-items:center;">
              <img src="${s.image || "image/IconLab.png"}" alt="${s.name}" />
              <div>
                <p><strong>${s.name}</strong></p>
                <p class="muted">${s.email}</p>
              </div>
            </div>
            <div><button type="button" class="btn-small danger" data-delete-responsible="${i}">${t("deleteBtn")}</button></div>
          </div>`
        )
        .join("")
    : `<p class="muted">${t("noResponsibleItems")}</p>`;
};

const setupResponsibleAdmin = () => {
  const form = byId("responsibleForm");
  if (!form) return;

  renderResponsibleAdminList();

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!requireAdminAction()) return;
    const name = byId("responsibleName").value.trim();
    const email = byId("responsibleEmail").value.trim().toLowerCase();
    const imageUrl = byId("responsibleImageUrl").value.trim();
    const file = byId("responsibleImageFile")?.files?.[0];
    const notice = byId("responsibleNotice");
    if (!name || !email) {
      setNotice(notice, t("fillAll"), "error");
      return;
    }
    if (!imageUrl && !file) {
      setNotice(notice, t("responsibleImageRequired"), "error");
      return;
    }
    let image = imageUrl || "image/IconLab.png";
    if (file) {
      try {
        image = await fileToDataUrl(file);
      } catch {
        image = imageUrl || "image/IconLab.png";
      }
    }

    const list = getResponsibleStaff();
    list.push({
      id: `staff-${Date.now()}`,
      name,
      email,
      image,
    });
    save(storageKeys.responsibleStaff, list);
    setNotice(notice, t("responsibleSaved"));
    form.reset();
    renderResponsibleAdminList();
    renderResponsibleOptions();
    renderEqResponsibleOptions();
    renderBroadcastRecipientList();
  });
};

const equipmentCropState = {
  image: null,
  zoom: 1,
  offsetX: 0,
  offsetY: 0,
  croppedDataUrl: "",
};
let editingEquipmentId = "";

const drawEquipmentCropCanvas = () => {
  const canvas = byId("eqCropCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#f5fbfd";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  if (!equipmentCropState.image) {
    ctx.fillStyle = "#8fa1b2";
    ctx.font = "14px sans-serif";
    ctx.fillText("No Image", 12, 24);
    return;
  }
  const frame = getCropFrame(canvas);
  const img = equipmentCropState.image;
  const scale = Math.max(frame.w / img.width, frame.h / img.height) * equipmentCropState.zoom;
  const drawW = img.width * scale;
  const drawH = img.height * scale;
  const dx = frame.x + (frame.w - drawW) / 2 + equipmentCropState.offsetX;
  const dy = frame.y + (frame.h - drawH) / 2 + equipmentCropState.offsetY;
  ctx.drawImage(img, dx, dy, drawW, drawH);
  ctx.fillStyle = "rgba(34,45,58,0.28)";
  ctx.beginPath();
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.rect(frame.x, frame.y, frame.w, frame.h);
  ctx.fill("evenodd");
  ctx.strokeStyle = "#7aafbf";
  ctx.lineWidth = 2;
  ctx.strokeRect(frame.x, frame.y, frame.w, frame.h);
};

const createEquipmentCroppedDataUrl = () => {
  const canvas = byId("eqCropCanvas");
  if (!canvas || !equipmentCropState.image) return "";
  const frame = getCropFrame(canvas);
  const img = equipmentCropState.image;
  const scale = Math.max(frame.w / img.width, frame.h / img.height) * equipmentCropState.zoom;
  const drawW = img.width * scale;
  const drawH = img.height * scale;
  const dx = frame.x + (frame.w - drawW) / 2 + equipmentCropState.offsetX;
  const dy = frame.y + (frame.h - drawH) / 2 + equipmentCropState.offsetY;
  const sx = (frame.x - dx) / scale;
  const sy = (frame.y - dy) / scale;
  const sw = frame.w / scale;
  const sh = frame.h / scale;
  if (sw <= 0 || sh <= 0) return "";
  const out = document.createElement("canvas");
  out.width = Math.round(frame.w);
  out.height = Math.round(frame.h);
  const outCtx = out.getContext("2d");
  if (!outCtx) return "";
  outCtx.drawImage(img, sx, sy, sw, sh, 0, 0, out.width, out.height);
  return out.toDataURL("image/jpeg", 0.9);
};

const setupEquipmentCropTool = () => {
  const input = byId("eqAdminImage");
  const zoom = byId("eqCropZoom");
  const x = byId("eqCropX");
  const y = byId("eqCropY");
  const applyBtn = byId("eqApplyCropBtn");
  const status = byId("eqCropStatus");
  if (!input || !zoom || !x || !y || !applyBtn || !status) return;

  const setStatus = (msg) => {
    status.textContent = msg;
  };

  input.addEventListener("change", () => {
    const file = input.files?.[0];
    equipmentCropState.croppedDataUrl = "";
    if (!file) {
      equipmentCropState.image = null;
      drawEquipmentCropCanvas();
      setStatus(t("cropEmpty"));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        equipmentCropState.image = img;
        equipmentCropState.zoom = 1;
        equipmentCropState.offsetX = 0;
        equipmentCropState.offsetY = 0;
        zoom.value = "1";
        x.value = "0";
        y.value = "0";
        drawEquipmentCropCanvas();
        setStatus(t("cropPending"));
      };
      img.src = String(reader.result || "");
    };
    reader.readAsDataURL(file);
  });

  [zoom, x, y].forEach((el) =>
    el.addEventListener("input", () => {
      equipmentCropState.zoom = Number(zoom.value || 1);
      equipmentCropState.offsetX = Number(x.value || 0);
      equipmentCropState.offsetY = Number(y.value || 0);
      drawEquipmentCropCanvas();
    })
  );

  applyBtn.addEventListener("click", () => {
    equipmentCropState.croppedDataUrl = createEquipmentCroppedDataUrl();
    setStatus(equipmentCropState.croppedDataUrl ? t("cropReady") : t("equipmentAdminImageRequired"));
  });

  drawEquipmentCropCanvas();
  setStatus(t("cropEmpty"));
};

const renderEquipmentAdminList = () => {
  const wrap = byId("equipmentAdminList");
  if (!wrap) return;
  const list = normalizeEquipmentItems();
  wrap.innerHTML = list.length
    ? list
        .map(
          (item, i) => `<div class="admin-item">
            <div style="display:flex;gap:0.6rem;align-items:center;${getAvailableQtyByItemId(item.id) <= 0 ? "opacity:0.5;" : ""}">
              <img src="${item.image || "image/IconLab.png"}" alt="${item.name}" style="width:62px;height:62px;border-radius:10px;object-fit:cover;border:1px solid #cadce3;" />
              <div>
                <p><strong>${item.name}</strong></p>
                <p class="muted">${t("equipmentTypeLabel")}: ${item.type || "ทั่วไป"}</p>
                <p class="muted">คงเหลือ ${getAvailableQtyByItemId(item.id)}/${item.stock} ${getAvailableQtyByItemId(item.id) <= 0 ? "(หมด)" : ""}</p>
              </div>
            </div>
            <div>
              <button type="button" class="btn-small" data-edit-equipment="${i}">แก้ไข</button>
              <button type="button" class="btn-small danger" data-delete-equipment="${i}">${t("deleteBtn")}</button>
            </div>
          </div>`
        )
        .join("")
    : `<p class="muted">ยังไม่มีรายการอุปกรณ์</p>`;
};

const setupEquipmentAdminTools = () => {
  const tools = byId("equipmentAdminTools");
  const form = byId("equipmentAdminForm");
  const body = byId("equipmentAdminBody");
  const toggleBtn = byId("toggleEquipmentAdminBtn");
  if (!tools || !form || !body || !toggleBtn) return;
  const typeSelect = byId("eqAdminType");
  const addTypeBtn = byId("eqAddTypeBtn");
  const newTypeInput = byId("eqAdminNewType");

  const renderEquipmentTypeOptions = (selectedType = "") => {
    if (!typeSelect) return;
    const types = normalizeEquipmentTypes();
    typeSelect.innerHTML = types
      .map((type) => `<option value="${type}">${type}</option>`)
      .join("");
    if (selectedType && types.includes(selectedType)) {
      typeSelect.value = selectedType;
    } else if (!typeSelect.value && types.length) {
      typeSelect.value = types[0];
    }
  };

  if (!isAdminSession()) {
    tools.hidden = true;
    return;
  }
  tools.hidden = false;
  body.hidden = true;
  toggleBtn.textContent = t("toggleShowEdit");
  renderEquipmentTypeOptions();
  renderEquipmentAdminList();

  if (!toggleBtn.dataset.bound) {
    toggleBtn.dataset.bound = "1";
    toggleBtn.addEventListener("click", () => {
      body.hidden = !body.hidden;
      toggleBtn.textContent = body.hidden ? t("toggleShowEdit") : t("toggleHideEdit");
    });
  }

  addTypeBtn?.addEventListener("click", () => {
    if (!requireAdminAction()) return;
    const value = String(newTypeInput?.value || "").trim();
    if (!value) return;
    const types = normalizeEquipmentTypes();
    if (!types.includes(value)) {
      types.push(value);
      save(storageKeys.equipmentTypes, types);
    }
    renderEquipmentTypeOptions(value);
    renderEquipmentTypeFilterOptions();
    renderEquipmentCatalog();
    if (newTypeInput) newTypeInput.value = "";
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!requireAdminAction()) return;
    const notice = byId("equipmentAdminNotice");
    const name = byId("eqAdminName")?.value?.trim() || "";
    const stock = Math.max(1, Number(byId("eqAdminStock")?.value || 1));
    const type = byId("eqAdminType")?.value?.trim() || "ทั่วไป";
    if (!name) {
      setNotice(notice, t("fillAll"), "error");
      return;
    }
    const list = normalizeEquipmentItems();
    const existing = editingEquipmentId ? list.find((i) => i.id === editingEquipmentId) : null;
    const image = equipmentCropState.croppedDataUrl || existing?.image || "";
    if (!image) {
      setNotice(notice, t("equipmentAdminImageRequired"), "error");
      return;
    }
    if (editingEquipmentId) {
      const index = list.findIndex((i) => i.id === editingEquipmentId);
      if (index >= 0) list[index] = { ...list[index], name, image, stock, type };
    } else {
      list.push({
        id: `eq-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name,
        image,
        stock,
        type,
      });
    }
    save(storageKeys.equipmentItems, list);
    setNotice(notice, t("equipmentAdminSaved"));
    form.reset();
    renderEquipmentTypeOptions();
    editingEquipmentId = "";
    equipmentCropState.image = null;
    equipmentCropState.croppedDataUrl = "";
    drawEquipmentCropCanvas();
    const cropStatus = byId("eqCropStatus");
    if (cropStatus) cropStatus.textContent = t("cropEmpty");
    renderEquipmentAdminList();
    renderEquipmentTypeFilterOptions();
    syncEquipmentEligibility();
  });

  byId("equipmentAdminList")?.addEventListener("click", (e) => {
    if (!requireAdminAction()) return;
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;

    if (target.dataset.editEquipment !== undefined) {
      const index = Number(target.dataset.editEquipment);
      const list = normalizeEquipmentItems();
      const item = list[index];
      if (!item) return;
      editingEquipmentId = item.id;
      byId("eqAdminName").value = item.name || "";
      byId("eqAdminStock").value = String(item.stock || 1);
      renderEquipmentTypeOptions(item.type || "ทั่วไป");
      equipmentCropState.croppedDataUrl = item.image || "";
      const img = new Image();
      img.onload = () => {
        equipmentCropState.image = img;
        equipmentCropState.zoom = 1;
        equipmentCropState.offsetX = 0;
        equipmentCropState.offsetY = 0;
        byId("eqCropZoom").value = "1";
        byId("eqCropX").value = "0";
        byId("eqCropY").value = "0";
        drawEquipmentCropCanvas();
      };
      img.src = item.image || "";
      return;
    }

    if (target.dataset.deleteEquipment !== undefined) {
      if (!window.confirm(t("confirmDeleteEquipment"))) return;
      const index = Number(target.dataset.deleteEquipment);
      const list = normalizeEquipmentItems();
      if (!list[index]) return;
      list.splice(index, 1);
      save(storageKeys.equipmentItems, list);
      renderEquipmentAdminList();
      syncEquipmentEligibility();
    }
  });
};
