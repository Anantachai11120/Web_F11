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
    if (roomLegendMine) roomLegendMine.hidden = !loggedIn;
    const roomBookingTab = document.querySelector('[data-room-tab="booking"]');
    const roomStatusTab = document.querySelector('[data-room-tab="status"]');
    if (roomBookingTab instanceof HTMLElement) roomBookingTab.hidden = !loggedIn;
    if (roomStatusTab instanceof HTMLElement) roomStatusTab.hidden = !loggedIn;
    const submit = roomForm.querySelector('button[type="submit"]');
    if (submit) submit.disabled = !loggedIn;
    if (roomHint) roomHint.textContent = loggedIn ? "" : t("loginRequiredToBook");
    setupRoomRulesPopup();
    if (typeof setupRoomSectionTabs === "function") setupRoomSectionTabs();
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

globalThis.updateBookingAuthUI = updateBookingAuthUI;
