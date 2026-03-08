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
  target.classList.toggle("single-post", visible.length === 1);

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
  const staffMap = new Map(getResponsibleStaff().map((s) => [String(s.id || ""), s]));
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
  const encodeAttr = (value) =>
    String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  for (let i = 0; i < 20; i += 1) {
    if (i >= slots.length) {
      html += `<div class="room-slot" data-slot-index="${i}" data-icon="image/userG.png" data-alt="empty" title="${t("roomSlotEmpty", { index: i + 1 })}"><img src="image/userG.png" alt="empty" /></div>`;
      continue;
    }
    const mine = slots[i].mine;
    const b = slots[i].booking;
    const icon = mine ? "image/userGre.png" : "image/userR.png";
    const owner = b.requesterName || b.name || "-";
    const responsible = staffMap.get(String(b.responsibleId || ""))?.name || "-";
    const title = mine
      ? t("roomSlotMineTitle", { index: i + 1, owner })
      : t("roomSlotOtherTitle", { index: i + 1, owner });
    html += `<div class="room-slot" data-slot-index="${i}" data-icon="${icon}" data-alt="${mine ? "mine" : "other"}" data-requester="${encodeAttr(owner)}" data-member1="${encodeAttr(b.member1 || "-")}" data-member2="${encodeAttr(b.member2 || "-")}" data-purpose="${encodeAttr(b.purpose || "-")}" data-responsible="${encodeAttr(responsible)}" title="${title}"><img src="${icon}" alt="${mine ? "mine" : "other"}" /></div>`;
  }
  grid.innerHTML = html;
  if (typeof resetRoomSlotExpandState === "function") resetRoomSlotExpandState();
};

const setupRoomBookingUI = () => {
  const form = byId("roomBookingForm");
  const today = new Date().toISOString().slice(0, 10);
  const pickDefaultTime = (selectId) => {
    const select = byId(selectId);
    if (!select || select.value) return;
    const first = Array.from(select.options || []).find((opt) => String(opt.value || "").trim());
    if (first) select.value = first.value;
  };
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
    pickDefaultTime("roomStatusTime");
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
  pickDefaultTime("roomTime");
  if (byId("roomTime") && byId("roomStatusTime") && !byId("roomStatusTime").value) {
    syncInputValue("roomTime", "roomStatusTime");
  }
  pickDefaultTime("roomStatusTime");

  byId("roomSlotsGrid")?.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    const slotEl = target.closest("[data-slot-index]");
    if (!(slotEl instanceof HTMLElement)) return;
    const index = Number(slotEl.dataset.slotIndex);
    const detail = byId("roomSlotDetail");
    if (!detail) return;
    const entry = currentRoomSlotEntries[index];
    if (typeof toggleRoomSlotExpand === "function") {
      toggleRoomSlotExpand(slotEl, index, entry);
      return;
    }
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

