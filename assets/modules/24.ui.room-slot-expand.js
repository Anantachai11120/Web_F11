let expandedRoomSlotElement = null;

const roomSlotEscapeHtml = (value) =>
  String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const collapseRoomSlotElement = (slotEl) => {
  if (!(slotEl instanceof HTMLElement)) return;
  slotEl.classList.remove("expanded");
  const icon = slotEl.dataset.icon || "image/userG.png";
  const alt = slotEl.dataset.alt || "empty";
  slotEl.innerHTML = `<img src="${icon}" alt="${alt}" />`;
};

const expandRoomSlotElement = (slotEl, index) => {
  if (!(slotEl instanceof HTMLElement)) return;
  const requester = roomSlotEscapeHtml(slotEl.dataset.requester || "-");
  const member1 = roomSlotEscapeHtml(slotEl.dataset.member1 || "-");
  const member2 = roomSlotEscapeHtml(slotEl.dataset.member2 || "-");
  const responsible = roomSlotEscapeHtml(slotEl.dataset.responsible || "-");
  const purpose = roomSlotEscapeHtml(slotEl.dataset.purpose || "-");
  const icon = slotEl.dataset.icon || "image/userG.png";
  const alt = slotEl.dataset.alt || "empty";
  const indexLabel = roomSlotEscapeHtml(index + 1);
  slotEl.classList.add("expanded");
  slotEl.innerHTML = `
    <div class="room-slot-expanded-head">
      <img src="${icon}" alt="${alt}" />
      <strong>#${indexLabel}</strong>
    </div>
    <div class="room-slot-expanded-body">
      <p><strong>${requester}</strong></p>
      <p>${member1}${member2 && member2 !== "-" ? `, ${member2}` : ""}</p>
      <p>ผู้รับผิดชอบ: ${responsible}</p>
      <p>${purpose}</p>
    </div>
  `;
};

const toggleRoomSlotExpand = (slotEl, index, entry) => {
  const detail = byId("roomSlotDetail");
  if (!(slotEl instanceof HTMLElement)) return;
  if (!entry) {
    if (detail) detail.textContent = t("roomSlotEmptyDetail", { index: index + 1 });
    if (expandedRoomSlotElement) {
      collapseRoomSlotElement(expandedRoomSlotElement);
      expandedRoomSlotElement = null;
    }
    return;
  }

  if (expandedRoomSlotElement && expandedRoomSlotElement !== slotEl) {
    collapseRoomSlotElement(expandedRoomSlotElement);
  }

  if (expandedRoomSlotElement === slotEl) {
    collapseRoomSlotElement(slotEl);
    expandedRoomSlotElement = null;
    if (detail) detail.textContent = t("roomHoverHint");
    return;
  }

  expandRoomSlotElement(slotEl, index);
  expandedRoomSlotElement = slotEl;
  const b = entry.booking || {};
  const responsible = roomSlotEscapeHtml(slotEl.dataset.responsible || "-");
  if (detail) {
    detail.innerHTML = t("roomSlotDetailFull", {
      index: index + 1,
      requester: b.requesterName || b.name || "-",
      member1: b.member1 || "-",
      member2: b.member2 || "-",
      purpose: b.purpose || "-",
      date: b.date || "-",
      timeSlot: b.timeSlot || "-",
      status: b.status || "-",
        }) + `<br>Responsible: ${responsible}`;
  }
};

const resetRoomSlotExpandState = () => {
  expandedRoomSlotElement = null;
};
