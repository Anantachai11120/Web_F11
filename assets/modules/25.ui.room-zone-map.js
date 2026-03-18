const defaultRoomZoneMapConfig = {
  baseImage: "image/room/roomaira.png",
  zones: [
    {
      id: "zone-a",
      label: "A",
      x: 20,
      y: 72,
      width: 28,
      height: 18,
      normalImage: "image/room/A1.png",
      bookedImage: "",
      actualImage: "",
    },
    {
      id: "zone-b",
      label: "B",
      x: 68,
      y: 58,
      width: 24,
      height: 16,
      normalImage: "image/room/B1.png",
      bookedImage: "",
      actualImage: "",
    },
  ],
};

const roomZoneUiText = () => {
  if (getLang() === "th") {
    return {
      bookingTitle: "จองพื้นที่ใช้งาน",
      bookingHint: "เลือกโซนจากแผนผังด้านล่าง",
      statusTitle: "สถานะพื้นที่ใช้งาน",
      statusHint: "คลิกโซนเพื่อดูรายละเอียดการจองของพื้นที่นั้น",
      noSelection: "ยังไม่ได้เลือกโซน",
      selected: "เลือกโซน {{zone}} แล้ว",
      unavailable: "โซน {{zone}} ถูกจองแล้วในช่วงเวลานี้",
      chooseDateTime: "เลือกวันและเวลาก่อนจึงจะเลือกพื้นที่ได้",
      statusIdle: "เลือกวันและเวลา แล้วคลิกโซนเพื่อดูรายละเอียด",
      detailNone: "โซน {{zone}} ยังว่าง",
      detailOne: "<strong>โซน {{zone}}</strong> | ผู้จอง: {{requester}} | สมาชิก: {{members}} | ผู้รับผิดชอบ: {{responsible}}",
      detailMany: "<strong>โซน {{zone}}</strong> | มี {{count}} รายการจอง",
      availableTag: "ว่าง",
      bookedTag: "จองแล้ว",
      closedTag: "ปิดใช้งาน",
      membersEmpty: "-",
      statusUnknown: "ไม่ทราบสถานะ",
      editorTitle: "จัดการแผนผังโซนพื้นที่",
      editorHint: "อัปโหลดภาพแผนผังหลัก เพิ่มโซน PNG แล้วลากวางตำแหน่งบนแผนที่ได้",
      editorEmpty: "ยังไม่มีโซนในแผนผัง",
      editorSaved: "บันทึกแผนผังพื้นที่เรียบร้อย",
      editorDeleted: "ลบโซนเรียบร้อย",
      editorNeedLabel: "กรุณากรอกชื่อโซน",
      editorNeedNormalImage: "กรุณาใส่ภาพโซนปกติ",
      editorEditLabel: "แก้ไขโซน",
      editorCreateLabel: "เพิ่มโซนใหม่",
      editorBaseUpdated: "บันทึกภาพแผนผังหลักแล้ว",
      editorReset: "รีเซ็ตแผนผังเป็นค่าเริ่มต้นแล้ว",
      editorZoneNormal: "ภาพโซนปกติ",
      editorZoneBooked: "ภาพโซนเมื่อถูกจอง",
      editorSelectZone: "เลือกโซนจากรายการเพื่อแก้ไข หรือสร้างใหม่",
      editorPreviewAlt: "zone preview",
      deleteZone: "ลบโซน",
      editZone: "แก้ไข",
      saveZone: "บันทึกโซน",
      resetMap: "รีเซ็ตแผนผัง",
      saveBase: "บันทึกภาพแผนผัง",
      baseImageLabel: "ภาพแผนผังหลัก",
      zoneIdLabel: "รหัสโซน",
      zoneLabelLabel: "ชื่อโซน",
      zoneWidthLabel: "ความกว้าง (%)",
      zoneHeightLabel: "ความสูง (%)",
      zonePositionHint: "ลากไอคอนบนแผนที่เพื่อเปลี่ยนตำแหน่งได้",
      zoneListTitle: "รายการโซน",
      roomZoneRequired: "กรุณาเลือกโซนพื้นที่",
    };
  }
  return {
    bookingTitle: "Area Booking",
    bookingHint: "Choose a zone from the map below.",
    statusTitle: "Area Status",
    statusHint: "Click a zone to inspect booking details.",
    noSelection: "No zone selected.",
    selected: "Selected zone {{zone}}.",
    unavailable: "Zone {{zone}} is already booked for this timeslot.",
    chooseDateTime: "Choose date and timeslot before selecting an area.",
    statusIdle: "Choose date and time, then click a zone to inspect details.",
    detailNone: "Zone {{zone}} is available.",
    detailOne: "<strong>Zone {{zone}}</strong> | Requester: {{requester}} | Members: {{members}} | Responsible: {{responsible}}",
    detailMany: "<strong>Zone {{zone}}</strong> | {{count}} bookings found.",
    availableTag: "Available",
    bookedTag: "Booked",
    closedTag: "Closed",
    membersEmpty: "-",
    statusUnknown: "Unknown",
    editorTitle: "Area Map Editor",
    editorHint: "Upload the main map image, add PNG zones, and drag them freely on the map.",
    editorEmpty: "No zones configured yet.",
    editorSaved: "Area map saved.",
    editorDeleted: "Zone deleted.",
    editorNeedLabel: "Please enter a zone name.",
    editorNeedNormalImage: "Please provide a normal zone image.",
    editorEditLabel: "Edit Zone",
    editorCreateLabel: "Create Zone",
    editorBaseUpdated: "Base map saved.",
    editorReset: "Area map reset to default.",
    editorZoneNormal: "Normal zone image",
    editorZoneBooked: "Booked zone image",
    editorSelectZone: "Select a zone to edit or create a new one.",
    editorPreviewAlt: "zone preview",
    deleteZone: "Delete",
    editZone: "Edit",
    saveZone: "Save zone",
    resetMap: "Reset map",
    saveBase: "Save map image",
    baseImageLabel: "Base map image",
    zoneIdLabel: "Zone id",
    zoneLabelLabel: "Zone name",
    zoneWidthLabel: "Width (%)",
    zoneHeightLabel: "Height (%)",
    zonePositionHint: "Drag the zone icon on the map to reposition it.",
    zoneListTitle: "Zone list",
    roomZoneRequired: "Please select an area zone.",
  };
};

const roomZoneUi = (key, vars = {}) => {
  let out = roomZoneUiText()[key] || key;
  Object.keys(vars).forEach((name) => {
    out = out.replaceAll(`{{${name}}}`, String(vars[name]));
  });
  return out;
};

const sanitizeRoomZoneId = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);

const cloneRoomZoneConfig = (config) => JSON.parse(JSON.stringify(config || defaultRoomZoneMapConfig));

const normalizeRoomZoneEntry = (zone, fallbackIndex = 0) => {
  const raw = zone && typeof zone === "object" ? zone : {};
  const id = sanitizeRoomZoneId(raw.id || raw.label || `zone-${fallbackIndex + 1}`) || `zone-${fallbackIndex + 1}`;
  const label = String(raw.label || raw.id || `Zone ${fallbackIndex + 1}`).trim() || `Zone ${fallbackIndex + 1}`;
  const x = Math.min(96, Math.max(0, Number(raw.x || 0)));
  const y = Math.min(96, Math.max(0, Number(raw.y || 0)));
  const width = Math.min(40, Math.max(5, Number(raw.width || 14)));
  const height = Math.min(40, Math.max(5, Number(raw.height || 12)));
  return {
    id,
    label,
    x,
    y,
    width,
    height,
    normalImage: String(raw.normalImage || "").trim(),
    bookedImage: String(raw.bookedImage || "").trim(),
    actualImage: String(raw.actualImage || "").trim(),
  };
};

const getRoomZoneMapConfig = () => {
  const stored = load(storageKeys.roomZoneMap, null);
  const source = stored && typeof stored === "object" ? stored : defaultRoomZoneMapConfig;
  const zones = Array.isArray(source.zones) ? source.zones.map((zone, index) => normalizeRoomZoneEntry(zone, index)) : [];
  const next = {
    baseImage: String(source.baseImage || defaultRoomZoneMapConfig.baseImage).trim() || defaultRoomZoneMapConfig.baseImage,
    zones,
  };
  if (!stored || JSON.stringify(stored) !== JSON.stringify(next)) {
    save(storageKeys.roomZoneMap, next);
  }
  return next;
};

const saveRoomZoneMapConfig = (config) => {
  save(storageKeys.roomZoneMap, cloneRoomZoneConfig(config));
};

const getRoomZoneById = (zoneId) => getRoomZoneMapConfig().zones.find((zone) => zone.id === String(zoneId || "").trim()) || null;

const getSelectedRoomZoneId = () => String(byId("selectedRoomZone")?.value || "").trim();

const setSelectedRoomZoneId = (zoneId) => {
  const normalized = String(zoneId || "").trim();
  const input = byId("selectedRoomZone");
  if (input) input.value = normalized;
  const notice = byId("roomZoneBookingNotice");
  if (!notice) return;
  const zone = getRoomZoneById(normalized);
  notice.textContent = zone ? roomZoneUi("selected", { zone: zone.label }) : roomZoneUi("noSelection");
};

const roomZoneMemberText = (booking) => {
  const members = [booking.member1, booking.member2].map((value) => String(value || "").trim()).filter(Boolean);
  return members.length ? members.join(", ") : roomZoneUi("membersEmpty");
};

const roomZoneBookingsForSelection = (selection) => {
  const all = roomBookingsBySelection(selection);
  return all.filter((booking) => String(booking.status || "").toLowerCase() !== "rejected");
};

const roomZoneOccupancy = (selection) => {
  const config = getRoomZoneMapConfig();
  const map = {};
  config.zones.forEach((zone) => {
    map[zone.id] = [];
  });
  roomZoneBookingsForSelection(selection).forEach((booking) => {
    const zoneId = String(booking.roomZone || "").trim();
    if (!zoneId) return;
    if (!map[zoneId]) map[zoneId] = [];
    map[zoneId].push(booking);
  });
  return map;
};

const roomZoneIsBlocked = (selection, zoneId, excludeBookingId = "") => {
  const closure = typeof findRoomClosure === "function" ? findRoomClosure({ ...selection, roomZone: zoneId }) : null;
  if (closure) return true;
  const map = roomZoneOccupancy(selection);
  const list = map[String(zoneId || "").trim()] || [];
  return list.some((booking) => String(booking.bookingId || booking.createdAt || "") !== String(excludeBookingId || ""));
};

const roomZoneStatusLabel = (zone, occupancy, closed) => {
  if (closed) return roomZoneUi("closedTag");
  return occupancy.length ? roomZoneUi("bookedTag") : roomZoneUi("availableTag");
};

const roomZoneMarkerImage = (zone, isBooked) => {
  const bookedImage = String(zone.bookedImage || "").trim();
  if (isBooked && bookedImage) return bookedImage;
  return String(zone.normalImage || "").trim();
};

const roomZonePreviewHtml = (zone, isBooked = false) => {
  if (!zone) return "";
  const src = String(zone.actualImage || "").trim() || roomZoneMarkerImage(zone, isBooked);
  if (!src) return "";
  return `
    <div class="room-zone-detail-preview">
      <img src="${src}" alt="${zone.label}" />
      <span>${zone.label}</span>
    </div>
  `;
};

const roomZoneModalImage = (zone, isBooked = false) =>
  String(zone?.actualImage || "").trim() || String(roomZoneMarkerImage(zone, isBooked) || "").trim();

const closeRoomZoneImageModal = () => {
  const modal = byId("roomZoneImageModal");
  const body = byId("roomZoneImageModalBody");
  if (body) body.innerHTML = "";
  if (modal) {
    modal.dataset.zoneId = "";
    modal.dataset.mode = "";
  }
  if (modal) modal.hidden = true;
};

const roomZoneModalActionHtml = (zone, selection, closed, occupancy, mode) => {
  if (mode !== "booking") return "";
  const isBlocked = Boolean(closed) || Boolean((occupancy[zone.id] || []).length);
  const selected = getSelectedRoomZoneId() === zone.id;
  if (closed) {
    return `<button type="button" class="btn-small danger room-zone-modal-action" disabled>${getLang() === "th" ? "ปิดใช้งานห้อง" : "Room closed"}</button>`;
  }
  if (isBlocked) {
    return `<button type="button" class="btn-small danger room-zone-modal-action" disabled>${getLang() === "th" ? "โซนนี้ถูกจองแล้ว" : "Already booked"}</button>`;
  }
  return `<button type="button" class="btn-small room-zone-modal-action" data-room-zone-modal-select="${zone.id}">${selected ? (getLang() === "th" ? `เลือกโซน ${zone.label} แล้ว` : `Zone ${zone.label} selected`) : (getLang() === "th" ? `จองโซน ${zone.label}` : `Book zone ${zone.label}`)}</button>`;
};

const openRoomZoneImageModal = (zoneId, selection = null, mode = "status") => {
  const zone = getRoomZoneById(zoneId);
  const modal = byId("roomZoneImageModal");
  const title = byId("roomZoneImageModalTitle");
  const body = byId("roomZoneImageModalBody");
  if (!zone || !modal || !title || !body) return;
  const activeSelection = selection || roomSelection();
  const occupancy = roomZoneOccupancy(activeSelection);
  const closed = typeof findRoomClosure === "function" ? findRoomClosure({ ...activeSelection, roomZone: zone.id }) : null;
  const isBooked = Boolean(closed) || Boolean((occupancy[zone.id] || []).length);
  const src = roomZoneModalImage(zone, isBooked);
  if (!src) return;
  title.textContent = getLang() === "th" ? `ภาพพื้นที่จริงของโซน ${zone.label}` : `Zone ${zone.label} area preview`;
  body.innerHTML = `
    <img src="${src}" alt="${zone.label}" />
    <div class="room-zone-modal-meta">
      <strong>${getLang() === "th" ? `โซน ${zone.label}` : `Zone ${zone.label}`}</strong>
      <span>${roomZoneStatusLabel(zone, occupancy[zone.id] || [], closed)}</span>
      ${roomZoneModalActionHtml(zone, activeSelection, closed, occupancy, mode)}
    </div>
  `;
  modal.dataset.zoneId = zone.id;
  modal.dataset.mode = mode;
  modal.hidden = false;
};

const roomZoneBookingSelectionHtml = (zoneId) => {
  const zone = getRoomZoneById(zoneId);
  if (!zone) return roomZoneUi("noSelection");
  const selection = {
    room: byId("roomFixed")?.value?.trim() || "Lab-F11",
    date: byId("roomDate")?.value?.trim() || "",
    timeSlot: byId("roomTime")?.value?.trim() || "",
  };
  const closed = typeof findRoomClosure === "function" ? findRoomClosure({ ...selection, roomZone: zone.id }) : null;
  const blocked = roomZoneIsBlocked(selection, zone.id);
  const isBooked = Boolean(closed) || blocked;
  const message = closed
    ? getLang() === "th"
      ? `<strong>โซน ${zone.label}</strong> | ปิดการใช้งานห้อง (${roomClosureLabel(closed)})`
      : `<strong>Zone ${zone.label}</strong> | Room closed (${roomClosureLabel(closed)})`
    : blocked
      ? getLang() === "th"
        ? `<strong>โซน ${zone.label}</strong> | มีการใช้งานแล้วในช่วงเวลานี้`
        : `<strong>Zone ${zone.label}</strong> | Already in use for this timeslot`
      : getLang() === "th"
        ? `<strong>โซน ${zone.label}</strong> | พร้อมสำหรับการเลือกจอง`
        : `<strong>Zone ${zone.label}</strong> | Ready to book`;
  return `${roomZonePreviewHtml(zone, isBooked)}${message}`;
};

const buildRoomZoneMapMarkup = ({ mode, selection, selectedZoneId = "", activeZoneId = "" }) => {
  const config = getRoomZoneMapConfig();
  const occupancy = roomZoneOccupancy(selection);
  const markers = config.zones
    .map((zone) => {
      const closed = typeof findRoomClosure === "function" ? findRoomClosure({ ...selection, roomZone: zone.id }) : null;
      const booked = Boolean(closed) || Boolean((occupancy[zone.id] || []).length);
      const src = roomZoneMarkerImage(zone, booked);
      return `
        <button
          type="button"
          class="room-zone-marker ${booked ? "booked" : "available"} ${selectedZoneId === zone.id ? "selected" : ""} ${activeZoneId === zone.id ? "focused" : ""}"
          data-room-zone="${zone.id}"
          style="left:${zone.x}%;top:${zone.y}%;width:${zone.width}%;height:${zone.height}%;"
          ${closed ? "disabled" : ""}
          title="${zone.label} | ${roomZoneStatusLabel(zone, occupancy[zone.id] || [], closed)}"
        >
          ${
            src
              ? `<img src="${src}" alt="${zone.label}" class="${booked && !String(zone.bookedImage || "").trim() ? "is-booked-fallback" : ""}" />`
              : `<span class="room-zone-fallback-label">${zone.label}</span>`
          }
          <span class="room-zone-badge">${zone.label}</span>
        </button>
      `;
    })
    .join("");

  return `
    <div class="room-zone-image-map ${mode}" data-room-zone-mode="${mode}">
      <img class="room-zone-base-image" src="${config.baseImage}" alt="room map" />
      <div class="room-zone-marker-layer">${markers}</div>
    </div>
  `;
};

const roomZoneDetailHtml = (zoneId) => {
  const zone = getRoomZoneById(zoneId);
  if (!zone) return roomZoneUi("statusUnknown");
  const selection = roomSelection();
  const closed = typeof findRoomClosure === "function" ? findRoomClosure({ ...selection, roomZone: zone.id }) : null;
  if (closed) {
    return `
      ${roomZonePreviewHtml(zone, true)}
      ${
        getLang() === "th"
          ? `<strong>โซน ${zone.label}</strong> | ปิดการใช้งานห้อง (${roomClosureLabel(closed)}) | เหตุผล: ${closed.reason || "-"}`
          : `<strong>Zone ${zone.label}</strong> | Room closed (${roomClosureLabel(closed)}) | Reason: ${closed.reason || "-"}`
      }
    `;
  }
  const map = roomZoneOccupancy(selection);
  const bookings = map[zone.id] || [];
  if (!bookings.length) {
    return `${roomZonePreviewHtml(zone, false)}${roomZoneUi("detailNone", { zone: zone.label })}`;
  }
  if (bookings.length === 1) {
    const booking = bookings[0];
    const responsible = getResponsibleStaff().find((staff) => String(staff.id || "") === String(booking.responsibleId || ""));
    return `
      ${roomZonePreviewHtml(zone, true)}
      ${roomZoneUi("detailOne", {
        zone: zone.label,
        requester: booking.requesterName || booking.name || "-",
        members: roomZoneMemberText(booking),
        responsible: responsible?.name || "-",
      })}
    `;
  }
  const detailLines = bookings
    .map((booking) => {
      const responsible = getResponsibleStaff().find((staff) => String(staff.id || "") === String(booking.responsibleId || ""));
      return `<div class="room-zone-detail-row"><strong>${booking.requesterName || booking.name || "-"}</strong><span>${roomZoneMemberText(booking)}</span><span>${responsible?.name || "-"}</span></div>`;
    })
    .join("");
  return `${roomZonePreviewHtml(zone, true)}${roomZoneUi("detailMany", { zone: zone.label, count: bookings.length })}<div class="room-zone-detail-list">${detailLines}</div>`;
};

const renderRoomZoneBookingMap = () => {
  const target = byId("roomZoneBookingMap");
  const detail = byId("roomZoneBookingDetail");
  if (!target) return;
  const selection = {
    room: byId("roomFixed")?.value?.trim() || "Lab-F11",
    date: byId("roomDate")?.value?.trim() || "",
    timeSlot: byId("roomTime")?.value?.trim() || "",
  };
  let selectedZoneId = getSelectedRoomZoneId();
  if (!selection.date || !selection.timeSlot || (selectedZoneId && roomZoneIsBlocked(selection, selectedZoneId))) {
    selectedZoneId = "";
  }
  setSelectedRoomZoneId(selectedZoneId);
  target.innerHTML = buildRoomZoneMapMarkup({
    mode: "booking",
    selection,
    selectedZoneId,
  });
  if (detail) {
    detail.innerHTML = selectedZoneId
      ? roomZoneBookingSelectionHtml(selectedZoneId)
      : (getLang() === "th"
        ? "คลิกโซนเพื่อดูภาพตัวอย่างและรายละเอียดของพื้นที่"
        : "Click a zone to preview the area image and details.");
  }
};

const renderRoomZoneStatusMap = (activeZoneId = "") => {
  const target = byId("roomZoneStatusMap");
  const detail = byId("roomZoneStatusDetail");
  if (!target) return;
  const selection = roomSelection();
  target.innerHTML = buildRoomZoneMapMarkup({
    mode: "status",
    selection,
    activeZoneId,
  });
  if (detail && !activeZoneId) {
    detail.dataset.locked = "";
    detail.textContent = roomZoneUi("statusIdle");
  }
};

const renderRoomZoneMaps = () => {
  const bookingTitle = byId("roomZoneBookingTitle");
  const bookingHint = byId("roomZoneBookingHint");
  const statusTitle = byId("roomZoneStatusTitle");
  const statusHint = byId("roomZoneStatusHint");
  if (bookingTitle) bookingTitle.textContent = roomZoneUi("bookingTitle");
  if (bookingHint) bookingHint.textContent = roomZoneUi("bookingHint");
  if (statusTitle) statusTitle.textContent = roomZoneUi("statusTitle");
  if (statusHint) statusHint.textContent = roomZoneUi("statusHint");
  renderRoomZoneBookingMap();
  renderRoomZoneStatusMap();
};

const setupRoomZoneBookingMap = () => {
  const bookingMap = byId("roomZoneBookingMap");
  const statusMap = byId("roomZoneStatusMap");
  const imageModal = byId("roomZoneImageModal");
  const imageModalClose = byId("roomZoneImageModalClose");
  if (imageModal && !imageModal.dataset.bound) {
    imageModal.dataset.bound = "1";
    imageModal.addEventListener("click", (event) => {
      const target = event.target;
      if (target instanceof HTMLElement) {
        const selectBtn = target.closest("[data-room-zone-modal-select]");
        if (selectBtn instanceof HTMLElement) {
          const zoneId = String(selectBtn.dataset.roomZoneModalSelect || "").trim();
          if (zoneId) {
            setSelectedRoomZoneId(zoneId);
            renderRoomZoneBookingMap();
            closeRoomZoneImageModal();
          }
          return;
        }
      }
      if (event.target === imageModal) closeRoomZoneImageModal();
    });
  }
  if (imageModalClose && !imageModalClose.dataset.bound) {
    imageModalClose.dataset.bound = "1";
    imageModalClose.addEventListener("click", closeRoomZoneImageModal);
  }
  if (bookingMap && !bookingMap.dataset.bound) {
    bookingMap.dataset.bound = "1";
    bookingMap.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const zoneMarker = target.closest("[data-room-zone]");
      if (!(zoneMarker instanceof HTMLElement)) return;
      const selection = {
        room: byId("roomFixed")?.value?.trim() || "Lab-F11",
        date: byId("roomDate")?.value?.trim() || "",
        timeSlot: byId("roomTime")?.value?.trim() || "",
      };
      if (!selection.date || !selection.timeSlot) {
        setSelectedRoomZoneId("");
        setNotice(byId("roomNotice"), roomZoneUi("chooseDateTime"), "error");
        return;
      }
      const zoneId = String(zoneMarker.dataset.roomZone || "").trim();
      const zone = getRoomZoneById(zoneId);
      if (!zone) return;
      openRoomZoneImageModal(zoneId, selection, "booking");
      if (roomZoneIsBlocked(selection, zoneId)) {
        setSelectedRoomZoneId("");
        setNotice(byId("roomNotice"), roomZoneUi("unavailable", { zone: zone.label }), "error");
        renderRoomZoneBookingMap();
        return;
      }
      setSelectedRoomZoneId(getSelectedRoomZoneId() === zoneId ? "" : zoneId);
      renderRoomZoneBookingMap();
    });
  }
  if (statusMap && !statusMap.dataset.bound) {
    statusMap.dataset.bound = "1";
    statusMap.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const zoneMarker = target.closest("[data-room-zone]");
      if (!(zoneMarker instanceof HTMLElement)) return;
      const zoneId = String(zoneMarker.dataset.roomZone || "").trim();
      openRoomZoneImageModal(zoneId, roomSelection(), "status");
      const detail = byId("roomZoneStatusDetail");
      if (detail) {
        detail.dataset.locked = "1";
        detail.innerHTML = roomZoneDetailHtml(zoneId);
      }
      renderRoomZoneStatusMap(zoneId);
    });
  }
  renderRoomZoneMaps();
};

let roomZoneEditorDraft = null;
let roomZoneEditorSelectedId = "";
let roomZoneDragState = null;
const roomZoneDragThreshold = 6;

const ensureRoomZoneEditorDraft = () => {
  if (!roomZoneEditorDraft) roomZoneEditorDraft = cloneRoomZoneConfig(getRoomZoneMapConfig());
  return roomZoneEditorDraft;
};

const resetRoomZoneEditorDraft = () => {
  roomZoneEditorDraft = cloneRoomZoneConfig(getRoomZoneMapConfig());
};

const fillRoomZoneEditorForm = (zoneId = "") => {
  const draft = ensureRoomZoneEditorDraft();
  const zone = draft.zones.find((item) => item.id === zoneId) || null;
  roomZoneEditorSelectedId = zone?.id || "";
  const set = (id, value) => {
    const el = byId(id);
    if (el) el.value = value;
  };
  set("adminRoomZoneId", zone?.id || "");
  set("adminRoomZoneLabel", zone?.label || "");
  set("adminRoomZoneWidth", zone?.width || 14);
  set("adminRoomZoneHeight", zone?.height || 12);
  set("adminRoomZoneNormalUrl", zone?.normalImage || "");
  set("adminRoomZoneBookedUrl", zone?.bookedImage || "");
  set("adminRoomZoneActualUrl", zone?.actualImage || "");
  const title = byId("adminRoomZoneFormTitle");
  if (title) title.textContent = zone ? roomZoneUi("editorEditLabel") : roomZoneUi("editorCreateLabel");
};

const roomZoneEditorSetNotice = (message, type = "ok") => {
  setNotice(byId("adminRoomZoneNotice"), message, type);
};

const readImageInputToDataUrl = async (fileInputId) => {
  const file = byId(fileInputId)?.files?.[0];
  if (!file) return "";
  try {
    return await fileToDataUrl(file);
  } catch {
    return "";
  }
};

const renderRoomZoneEditorStage = () => {
  const target = byId("adminRoomZoneStage");
  if (!target) return;
  const draft = ensureRoomZoneEditorDraft();
  const markers = draft.zones
    .map((zone) => {
      const booked = false;
      const src = roomZoneMarkerImage(zone, booked);
      return `
        <button
          type="button"
          class="admin-room-zone-marker ${roomZoneEditorSelectedId === zone.id ? "selected" : ""}"
          data-editor-zone="${zone.id}"
          style="left:${zone.x}%;top:${zone.y}%;width:${zone.width}%;height:${zone.height}%;"
        >
          ${src ? `<img src="${src}" alt="${roomZoneUi("editorPreviewAlt")}" />` : `<span>${zone.label}</span>`}
          <span class="room-zone-badge">${zone.label}</span>
        </button>
      `;
    })
    .join("");
  target.innerHTML = `
    <div class="admin-room-zone-canvas">
      <img class="room-zone-base-image" src="${draft.baseImage}" alt="room map editor" />
      <div class="room-zone-marker-layer">${markers}</div>
    </div>
  `;
};

const renderRoomZoneEditorList = () => {
  const target = byId("adminRoomZoneList");
  if (!target) return;
  const draft = ensureRoomZoneEditorDraft();
  target.innerHTML = draft.zones.length
    ? draft.zones
        .map(
          (zone) => `<div class="admin-item">
            <div>
              <p><strong>${zone.label}</strong> (${zone.id})</p>
              <p class="muted">x: ${zone.x.toFixed(1)}% | y: ${zone.y.toFixed(1)}% | w: ${zone.width}% | h: ${zone.height}%</p>
            </div>
            <div class="feed-actions-end inline-actions">
              <button type="button" class="btn-small" data-edit-room-zone="${zone.id}">${roomZoneUi("editZone")}</button>
              <button type="button" class="btn-small danger" data-delete-room-zone="${zone.id}">${roomZoneUi("deleteZone")}</button>
            </div>
          </div>`
        )
        .join("")
    : `<p class="muted">${roomZoneUi("editorEmpty")}</p>`;
};

const renderRoomZoneAdminEditor = () => {
  const title = byId("adminRoomZoneEditorTitle");
  const hint = byId("adminRoomZoneEditorHint");
  const listTitle = byId("adminRoomZoneListTitle");
  const baseLabel = byId("adminRoomZoneBaseImageLabel");
  const zonePosHint = byId("adminRoomZonePositionHint");
  const saveBaseBtn = byId("adminRoomZoneBaseSaveBtn");
  const resetBtn = byId("adminRoomZoneResetBtn");
  const saveZoneBtn = byId("adminRoomZoneSaveBtn");
  if (title) title.textContent = roomZoneUi("editorTitle");
  if (hint) hint.textContent = roomZoneUi("editorHint");
  if (listTitle) listTitle.textContent = roomZoneUi("zoneListTitle");
  if (baseLabel) baseLabel.textContent = roomZoneUi("baseImageLabel");
  if (zonePosHint) zonePosHint.textContent = roomZoneUi("zonePositionHint");
  if (saveBaseBtn) saveBaseBtn.textContent = roomZoneUi("saveBase");
  if (resetBtn) resetBtn.textContent = roomZoneUi("resetMap");
  if (saveZoneBtn) saveZoneBtn.textContent = roomZoneUi("saveZone");
  renderRoomZoneEditorStage();
  renderRoomZoneEditorList();
  fillRoomZoneEditorForm(roomZoneEditorSelectedId);
};

const updateDraftZonePosition = (zoneId, x, y) => {
  const draft = ensureRoomZoneEditorDraft();
  const zone = draft.zones.find((item) => item.id === zoneId);
  if (!zone) return;
  zone.x = Math.min(96, Math.max(0, x));
  zone.y = Math.min(96, Math.max(0, y));
};

const syncSelectedRoomZoneDraftFromForm = () => {
  if (!roomZoneEditorSelectedId) return;
  const draft = ensureRoomZoneEditorDraft();
  const zone = draft.zones.find((item) => item.id === roomZoneEditorSelectedId);
  if (!zone) return;
  const nextLabel = String(byId("adminRoomZoneLabel")?.value || "").trim();
  const nextWidth = Number(byId("adminRoomZoneWidth")?.value || zone.width || 14);
  const nextHeight = Number(byId("adminRoomZoneHeight")?.value || zone.height || 12);
  const nextNormalUrl = String(byId("adminRoomZoneNormalUrl")?.value || "").trim();
  const nextBookedUrl = String(byId("adminRoomZoneBookedUrl")?.value || "").trim();
  const nextActualUrl = String(byId("adminRoomZoneActualUrl")?.value || "").trim();
  zone.label = nextLabel || zone.label;
  zone.width = Math.min(40, Math.max(5, nextWidth || zone.width || 14));
  zone.height = Math.min(40, Math.max(5, nextHeight || zone.height || 12));
  if (nextNormalUrl) zone.normalImage = nextNormalUrl;
  if (nextBookedUrl || byId("adminRoomZoneBookedUrl")?.value === "") zone.bookedImage = nextBookedUrl;
  if (nextActualUrl || byId("adminRoomZoneActualUrl")?.value === "") zone.actualImage = nextActualUrl;
  renderRoomZoneEditorStage();
  renderRoomZoneEditorList();
};

const saveRoomZoneEditorDraft = () => {
  saveRoomZoneMapConfig(ensureRoomZoneEditorDraft());
  roomZoneEditorSetNotice(roomZoneUi("editorSaved"));
  renderRoomZoneMaps();
};

const setupRoomZoneAdminEditor = () => {
  if (!isCurrentPage("admin.html")) return;
  const form = byId("adminRoomZoneForm");
  const baseForm = byId("adminRoomZoneBaseForm");
  const stage = byId("adminRoomZoneStage");
  const list = byId("adminRoomZoneList");
  if (!form || !baseForm || !stage || !list) return;
  resetRoomZoneEditorDraft();

  if (!baseForm.dataset.bound) {
    baseForm.dataset.bound = "1";
    baseForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!requireAdminAction()) return;
      const draft = ensureRoomZoneEditorDraft();
      const fileImage = await readImageInputToDataUrl("adminRoomZoneBaseFile");
      const urlImage = String(byId("adminRoomZoneBaseUrl")?.value || "").trim();
      let baseImage = fileImage || urlImage || draft.baseImage || defaultRoomZoneMapConfig.baseImage;
      if (baseImage.startsWith("data:image/")) {
        try {
          baseImage = await persistImageSource(baseImage, {
            category: "room-maps",
            filenameBase: "room-map",
            maxSize: 1920,
            quality: 0.92,
          });
        } catch {
          roomZoneEditorSetNotice(getLang() === "th" ? "อัปโหลดภาพแผนผังไม่สำเร็จ" : "Failed to upload room map.", "error");
          return;
        }
      }
      draft.baseImage = baseImage;
      saveRoomZoneEditorDraft();
      roomZoneEditorSetNotice(roomZoneUi("editorBaseUpdated"));
      renderRoomZoneAdminEditor();
    });
  }

  if (!form.dataset.bound) {
    form.dataset.bound = "1";
    ["adminRoomZoneLabel", "adminRoomZoneWidth", "adminRoomZoneHeight", "adminRoomZoneNormalUrl", "adminRoomZoneBookedUrl", "adminRoomZoneActualUrl"].forEach((fieldId) => {
      const field = byId(fieldId);
      if (!field || field.dataset.previewBound) return;
      field.dataset.previewBound = "1";
      field.addEventListener("input", () => {
        syncSelectedRoomZoneDraftFromForm();
      });
    });
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!requireAdminAction()) return;
      const draft = ensureRoomZoneEditorDraft();
      const rawId = String(byId("adminRoomZoneId")?.value || "").trim();
      const label = String(byId("adminRoomZoneLabel")?.value || "").trim();
      const width = Number(byId("adminRoomZoneWidth")?.value || 14);
      const height = Number(byId("adminRoomZoneHeight")?.value || 12);
      const normalFile = await readImageInputToDataUrl("adminRoomZoneNormalFile");
      const bookedFile = await readImageInputToDataUrl("adminRoomZoneBookedFile");
      const actualFile = await readImageInputToDataUrl("adminRoomZoneActualFile");
      const normalUrl = String(byId("adminRoomZoneNormalUrl")?.value || "").trim();
      const bookedUrl = String(byId("adminRoomZoneBookedUrl")?.value || "").trim();
      const actualUrl = String(byId("adminRoomZoneActualUrl")?.value || "").trim();
      const id = sanitizeRoomZoneId(rawId || label);
      if (!label) {
        roomZoneEditorSetNotice(roomZoneUi("editorNeedLabel"), "error");
        return;
      }
      const editing = draft.zones.find((zone) => zone.id === roomZoneEditorSelectedId) || null;
      if (!editing && !normalFile && !normalUrl) {
        roomZoneEditorSetNotice(roomZoneUi("editorNeedNormalImage"), "error");
        return;
      }
      const existsSameId = draft.zones.find((zone) => zone.id === id && zone.id !== roomZoneEditorSelectedId);
      if (existsSameId) {
        roomZoneEditorSetNotice(getLang() === "th" ? "รหัสโซนนี้ถูกใช้แล้ว" : "Zone id already exists.", "error");
        return;
      }
      let normalImage = normalFile || normalUrl || editing?.normalImage || "";
      let bookedImage = bookedFile || bookedUrl || editing?.bookedImage || "";
      let actualImage = actualFile || actualUrl || editing?.actualImage || "";
      try {
        if (normalImage.startsWith("data:image/")) {
          normalImage = await persistImageSource(normalImage, {
            category: "room-zones",
            filenameBase: `${label || id || "zone"}-normal`,
            maxSize: 1200,
            quality: 0.9,
          });
        }
        if (bookedImage.startsWith("data:image/")) {
          bookedImage = await persistImageSource(bookedImage, {
            category: "room-zones",
            filenameBase: `${label || id || "zone"}-booked`,
            maxSize: 1200,
            quality: 0.9,
          });
        }
        if (actualImage.startsWith("data:image/")) {
          actualImage = await persistImageSource(actualImage, {
            category: "room-zones",
            filenameBase: `${label || id || "zone"}-actual`,
            maxSize: 1600,
            quality: 0.92,
          });
        }
      } catch {
        roomZoneEditorSetNotice(getLang() === "th" ? "อัปโหลดรูปโซนไม่สำเร็จ" : "Failed to upload zone image.", "error");
        return;
      }
      const next = normalizeRoomZoneEntry(
        {
          id,
          label,
          x: editing?.x ?? 20,
          y: editing?.y ?? 20,
          width,
          height,
          normalImage,
          bookedImage,
          actualImage,
        },
        draft.zones.length
      );
      if (editing) {
        Object.assign(editing, next);
      } else {
        draft.zones.push(next);
      }
      roomZoneEditorSelectedId = next.id;
      saveRoomZoneEditorDraft();
      renderRoomZoneAdminEditor();
    });
  }

  if (!stage.dataset.bound) {
    stage.dataset.bound = "1";
    stage.addEventListener("mousedown", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const marker = target.closest("[data-editor-zone]");
      if (!(marker instanceof HTMLElement)) return;
      const zoneId = String(marker.dataset.editorZone || "").trim();
      const canvas = stage.querySelector(".admin-room-zone-canvas");
      if (!(canvas instanceof HTMLElement)) return;
      const rect = canvas.getBoundingClientRect();
      roomZoneDragState = {
        zoneId,
        rect,
        startClientX: event.clientX,
        startClientY: event.clientY,
        moved: false,
      };
      roomZoneEditorSelectedId = zoneId;
      fillRoomZoneEditorForm(zoneId);
      event.preventDefault();
    });
    document.addEventListener("mousemove", (event) => {
      if (!roomZoneDragState) return;
      const deltaX = event.clientX - roomZoneDragState.startClientX;
      const deltaY = event.clientY - roomZoneDragState.startClientY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      if (!roomZoneDragState.moved && distance < roomZoneDragThreshold) return;
      roomZoneDragState.moved = true;
      const x = ((event.clientX - roomZoneDragState.rect.left) / roomZoneDragState.rect.width) * 100;
      const y = ((event.clientY - roomZoneDragState.rect.top) / roomZoneDragState.rect.height) * 100;
      updateDraftZonePosition(roomZoneDragState.zoneId, x, y);
      renderRoomZoneEditorStage();
      renderRoomZoneEditorList();
    });
    document.addEventListener("mouseup", () => {
      if (!roomZoneDragState) return;
      if (!roomZoneDragState.moved) {
        renderRoomZoneEditorStage();
      }
      roomZoneDragState = null;
    });
  }

  if (!list.dataset.bound) {
    list.dataset.bound = "1";
    list.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const editBtn = target.closest("[data-edit-room-zone]");
      if (editBtn instanceof HTMLElement) {
        roomZoneEditorSelectedId = String(editBtn.dataset.editRoomZone || "").trim();
        fillRoomZoneEditorForm(roomZoneEditorSelectedId);
        renderRoomZoneEditorStage();
        return;
      }
      const deleteBtn = target.closest("[data-delete-room-zone]");
      if (deleteBtn instanceof HTMLElement) {
        if (!window.confirm(getLang() === "th" ? "ยืนยันลบโซนนี้?" : "Delete this zone?")) return;
        const zoneId = String(deleteBtn.dataset.deleteRoomZone || "").trim();
        const draft = ensureRoomZoneEditorDraft();
        draft.zones = draft.zones.filter((zone) => zone.id !== zoneId);
        if (roomZoneEditorSelectedId === zoneId) roomZoneEditorSelectedId = "";
        saveRoomZoneEditorDraft();
        roomZoneEditorSetNotice(roomZoneUi("editorDeleted"));
        renderRoomZoneAdminEditor();
      }
    });
  }

  const createBtn = byId("adminRoomZoneCreateBtn");
  if (createBtn && !createBtn.dataset.bound) {
    createBtn.dataset.bound = "1";
    createBtn.addEventListener("click", () => {
      roomZoneEditorSelectedId = "";
      fillRoomZoneEditorForm("");
      roomZoneEditorSetNotice(roomZoneUi("editorSelectZone"));
    });
  }

  const resetBtn = byId("adminRoomZoneResetBtn");
  if (resetBtn && !resetBtn.dataset.bound) {
    resetBtn.dataset.bound = "1";
    resetBtn.addEventListener("click", () => {
      if (!window.confirm(getLang() === "th" ? "รีเซ็ตแผนผังกลับค่าเริ่มต้น?" : "Reset the map to default?")) return;
      roomZoneEditorDraft = cloneRoomZoneConfig(defaultRoomZoneMapConfig);
      roomZoneEditorSelectedId = "";
      saveRoomZoneEditorDraft();
      roomZoneEditorSetNotice(roomZoneUi("editorReset"));
      renderRoomZoneAdminEditor();
    });
  }

  renderRoomZoneAdminEditor();
};

Object.assign(globalThis, {
  renderRoomZoneMaps,
  setupRoomZoneBookingMap,
  setupRoomZoneAdminEditor,
});

