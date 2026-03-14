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
    nameEn: String(it.nameEn || "").trim(),
    image: it.image || "image/IconLab.png",
    stock: Math.max(1, Number(it.stock || 1)),
    type: it.type || "ทั่วไป",
    usageGuide: String(it.usageGuide || "").trim(),
  }));

const safeNamedCallEq = (name, ...args) => {
  const fn = globalThis[name];
  if (typeof fn !== "function") return undefined;
  try {
    return fn(...args);
  } catch {
    return undefined;
  }
};

const getCurrentUserEq =
  typeof getCurrentUser === "function"
    ? getCurrentUser
    : () => {
        const session = load(storageKeys.session, null);
        if (!session) return null;
        const users = load(storageKeys.users, []);
        return users.find((user) => user.username === session.username) || session || null;
      };

const getResponsibleStaffEq =
  typeof getResponsibleStaff === "function"
    ? getResponsibleStaff
    : () => load(storageKeys.responsibleStaff, defaultResponsibleStaff);

const isBookingOwnedByUserEq =
  typeof isBookingOwnedByUser === "function"
    ? isBookingOwnedByUser
    : (booking, user) => {
        if (!user) return false;
        if (booking?.username && booking.username === user.username) return true;
        if (booking?.email && booking.email === user.email) return true;
        const ownerName = booking?.requesterName || booking?.name || "";
        return Boolean(ownerName && ownerName === user.name);
      };

const equipmentNameByLang = (item, fallback = "-") => {
  if (!item) return fallback;
  const th = String(item.name || "").trim();
  const en = String(item.nameEn || "").trim();
  if (getLang() === "en") return en || th || fallback;
  return th || en || fallback;
};
const openEquipmentGuideModal = (item) => {
  const modal = byId("equipmentGuideModal");
  const title = byId("equipmentGuideTitle");
  const typeText = byId("equipmentGuideType");
  const content = byId("equipmentGuideContent");
  const closeBtn = byId("equipmentGuideCloseBtn");
  if (!modal || !title || !typeText || !content || !closeBtn || !item) return;

  title.textContent = `${t("equipmentUsageModalTitle")} - ${equipmentNameByLang(item, "-")}`;
  typeText.textContent = t("equipmentUsageTypeText", { type: item.type || "-" });
  content.textContent = item.usageGuide || t("equipmentUsageEmpty");
  modal.hidden = false;
  document.body.classList.add("no-scroll");

  const closeModal = () => {
    modal.hidden = true;
    document.body.classList.remove("no-scroll");
    closeBtn.removeEventListener("click", closeModal);
    modal.removeEventListener("click", onBackdropClick);
  };
  const onBackdropClick = (e) => {
    if (e.target === modal) closeModal();
  };
  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", onBackdropClick);
};
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
    .filter((b) => b.itemId === itemId || (!b.itemId && item && (b.item === item.name || b.item === item.nameEn)))
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
  const idByName = new Map();
  items.forEach((it) => {
    const nameTh = String(it.name || "");
    const nameEn = String(it.nameEn || "");
    if (nameTh) idByName.set(nameTh, String(it.id || ""));
    if (nameEn) idByName.set(nameEn, String(it.id || ""));
  });
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
    .filter((b) => isBookingOwnedByUserEq(b, user))
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
        <p><strong>${getLang() === "en" ? (entry.nameEn || entry.name) : (entry.name || entry.nameEn || "-")}</strong></p>
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

  const me = getCurrentUserEq();
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
          <div class="equipment-card-top">
            <button type="button" class="btn-small equipment-guide-btn" data-eq-guide="${item.id}">${t("equipmentGuideBtn")}</button>
          </div>
          <img src="${item.image}" alt="${equipmentNameByLang(item, item.name)}" />
          <p><strong>${equipmentNameByLang(item, item.name)}</strong></p>
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
        const item = items.find((x) => x.id === b.itemId || (!b.itemId && (x.name === b.item || x.nameEn === b.item)));
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
            const item = items.find((x) => x.id === r.itemId || x.name === r.item || x.nameEn === r.item);
            return `<div class="equipment-card">
              <div class="equipment-card-top">
                <button type="button" class="btn-small equipment-guide-btn" data-eq-guide="${item?.id || ""}">${t("equipmentGuideBtn")}</button>
              </div>
              <img src="${item?.image || "image/IconLab.png"}" alt="${r.item}" />
              <p><strong>${equipmentNameByLang(item, r.item)}</strong></p>
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
    const item = items.find((x) => x.id === b.itemId || (!b.itemId && (x.name === b.item || x.nameEn === b.item)));
    const itemType = item?.type || "ทั่วไป";
    return selectedType === "all" || itemType === selectedType;
  });
  grid.innerHTML = bookings.length
    ? bookings
        .map((b) => {
          const item = items.find((x) => x.id === b.itemId);
          return `<div class="equipment-card">
            <div class="equipment-card-top">
              <button type="button" class="btn-small equipment-guide-btn" data-eq-guide="${item?.id || ""}">${t("equipmentGuideBtn")}</button>
            </div>
            <img src="${item?.image || "image/IconLab.png"}" alt="${equipmentNameByLang(item, b.item)}" />
            <p><strong>${equipmentNameByLang(item, b.item)}</strong> x ${b.quantity}</p>
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
  const list = getResponsibleStaffEq();
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
    hidden.value = getResponsibleStaffEq()[0]?.id || "";
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
    .filter((b) => isBookingOwnedByUserEq(b, user))
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

  const user = getCurrentUserEq();
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
  const catalogGrid = byId("eqCatalogGrid");

  const eqListFilter = byId("eqListFilter");
  const eqTypeFilter = byId("eqTypeFilter");
  if (eqListFilter && !eqListFilter.dataset.bound) {
    eqListFilter.dataset.bound = "1";
    eqListFilter.addEventListener("change", () => {
      renderEquipmentCatalog();
    });
  }
  if (eqTypeFilter && !eqTypeFilter.dataset.bound) {
    eqTypeFilter.dataset.bound = "1";
    eqTypeFilter.addEventListener("change", () => {
      renderEquipmentCatalog();
    });
  }
  if (catalogGrid && !catalogGrid.dataset.bound) {
    catalogGrid.dataset.bound = "1";
    catalogGrid.addEventListener("click", (e) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      const guideBtn = target.closest("[data-eq-guide]");
      if (guideBtn instanceof HTMLElement) {
        const itemId = String(guideBtn.dataset.eqGuide || "");
        const item = normalizeEquipmentItems().find((x) => x.id === itemId);
        if (item) openEquipmentGuideModal(item);
        return;
      }
      const itemCard = target.closest("[data-eq-item-id]");
      if (!(itemCard instanceof HTMLElement)) return;
      const mode = byId("eqListFilter")?.value || "all";
      if (!(mode === "all" || mode === "available")) return;
      const itemId = itemCard.dataset.eqItemId || "";
      const available = getAvailableQtyByItemId(itemId);
      const canPickEquipment = Boolean(byId("eqTime")?.value);
      if (!canPickEquipment || available <= 0) return;
      const item = normalizeEquipmentItems().find((x) => x.id === itemId);
      selectedEquipmentItemId = itemId;
      byId("eqSelectedItemLabel").value = item
        ? `${equipmentNameByLang(item, item.name)} (${t("equipmentLeftLabel", { available, stock: item.stock })})`
        : t("equipmentSelectDefault");
      renderEquipmentCatalog();
    });
  }

  const me = getCurrentUserEq();
  if (!me) {
    refreshEquipmentFilterLabels();
    renderEquipmentTypeFilterOptions();
    syncEquipmentEligibility();
    renderEquipmentCatalog();
    setupEquipmentRulesPopup();
    return;
  }
  if (me && byId("eqName") && !byId("eqName").value) {
    byId("eqName").value = me.username || me.name || me.email || "";
  }
  selectedEquipmentEntries = [];
  renderSelectedEquipmentList();
  if (byId("eqSelectedItemLabel")) byId("eqSelectedItemLabel").value = t("equipmentSelectDefault");
  refreshEquipmentFilterLabels();
  renderEquipmentTypeFilterOptions();

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
      nameEn: item.nameEn || "",
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
    const meUser = getCurrentUserEq();
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
    const currentUser = getCurrentUserEq();
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
      .filter((b) => isBookingOwnedByUserEq(b, currentUser))
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
    if (hidden) hidden.value = getResponsibleStaffEq()[0]?.id || "";
    selectedEquipmentItemId = "";
    selectedEquipmentEntries = [];
    renderSelectedEquipmentList();
    syncEquipmentEligibility();
    safeNamedCallEq("renderDashboard");
    safeNamedCallEq("renderRoomApproval");
    safeNamedCallEq("renderRoomSlots");
    safeNamedCallEq("renderResponsibleOptions");
    renderEqResponsibleOptions();
    safeNamedCallEq("renderProfilePage");
    safeNamedCallEq("renderAdminUserProfilePanel");
  });

  setupEqResponsibleSelector();
  byId("eqDate")?.addEventListener("change", syncEquipmentEligibility);
  byId("eqTime")?.addEventListener("change", syncEquipmentEligibility);
  syncEquipmentEligibility();
};

Object.assign(globalThis, {
  renderEquipmentTypeFilterOptions,
  refreshEquipmentFilterLabels,
  renderSelectedEquipmentList,
  renderEquipmentCatalog,
  renderEqResponsibleOptions,
  setupEqResponsibleSelector,
  setupEquipmentBookingUI,
});




