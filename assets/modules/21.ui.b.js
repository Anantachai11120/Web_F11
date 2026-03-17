const staffUi = (key, vars = {}) => {
  const dict = getLang() === "th"
    ? {
        noResponsibleOptions: "ยังไม่มีบุคลากรผู้รับผิดชอบ",
        aboutTitle: "เกี่ยวกับเรา",
        aboutSummary: "สมาชิกแลป",
        aboutFilterLabel: "หมวดหมู่ตำแหน่ง",
        aboutAll: "ทั้งหมด",
        aboutEmpty: "ยังไม่มีสมาชิกในหมวดหมู่นี้",
        positionFallback: "ผู้ดูแลแลป",
      }
    : {
        noResponsibleOptions: "No responsible staff available.",
        aboutTitle: "About Us",
        aboutSummary: "Lab Members",
        aboutFilterLabel: "Position Category",
        aboutAll: "All",
        aboutEmpty: "No members in this category yet.",
        positionFallback: "Lab Staff",
      };
  let out = dict[key] || key;
  Object.keys(vars).forEach((name) => {
    out = out.replaceAll(`{{${name}}}`, String(vars[name]));
  });
  return out;
};

const normalizeResponsibleStaffItems = () => {
  const raw = load(storageKeys.responsibleStaff, defaultResponsibleStaff);
  let changed = false;
  const normalized = raw.map((item, index) => {
    const next = {
      id: String(item?.id || `staff-${index + 1}`).trim(),
      name: String(item?.name || "").trim(),
      email: String(item?.email || "").trim().toLowerCase(),
      image: String(item?.image || "image/IconLab.png").trim() || "image/IconLab.png",
      position: String(item?.position || defaultStaffPositions[0] || staffUi("positionFallback")).trim() || (defaultStaffPositions[0] || staffUi("positionFallback")),
    };
    if (
      next.id !== item?.id ||
      next.name !== item?.name ||
      next.email !== item?.email ||
      next.image !== item?.image ||
      next.position !== item?.position
    ) {
      changed = true;
    }
    return next;
  }).filter((item) => item.name && item.email);
  if (changed) save(storageKeys.responsibleStaff, normalized);
  return normalized;
};

const normalizeStaffPositions = () => {
  const raw = load(storageKeys.staffPositions, defaultStaffPositions);
  const normalized = [...new Set(
    (Array.isArray(raw) ? raw : defaultStaffPositions)
      .map((item) => String(item || "").trim())
      .filter(Boolean)
  )];
  if (JSON.stringify(raw) !== JSON.stringify(normalized)) save(storageKeys.staffPositions, normalized);
  return normalized;
};

const getResponsibleStaff = () => normalizeResponsibleStaffItems();

const getStaffPositions = () => {
  const fromStorage = normalizeStaffPositions();
  const fromStaff = getResponsibleStaff().map((item) => item.position).filter(Boolean);
  const merged = [...new Set([...defaultStaffPositions, ...fromStorage, ...fromStaff])];
  const raw = load(storageKeys.staffPositions, defaultStaffPositions);
  if (JSON.stringify(raw) !== JSON.stringify(merged)) save(storageKeys.staffPositions, merged);
  return merged;
};

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
              <p class="responsible-role">${s.position || staffUi("positionFallback")}</p>
              <p class="responsible-email">${s.email}</p>
            </div>
          </div>`
        )
        .join("")
    : `<p class="muted">${staffUi("noResponsibleOptions")}</p>`;
};

const renderHomeAboutSection = () => {
  const section = byId("labAboutSection");
  const filter = byId("labAboutPositionFilter");
  const listWrap = byId("labAboutMembers");
  if (!section || !filter || !listWrap) return;
  const summaryPrimary = section.querySelector("summary span");
  const summarySecondary = section.querySelector("summary strong");
  const filterLabel = section.querySelector("label[for='labAboutPositionFilter']");
  if (summaryPrimary) summaryPrimary.textContent = staffUi("aboutTitle");
  if (summarySecondary) summarySecondary.textContent = staffUi("aboutSummary");
  if (filterLabel) filterLabel.textContent = staffUi("aboutFilterLabel");

  const staff = getResponsibleStaff();
  const positions = getStaffPositions();
  const currentValue = String(filter.value || "all").trim() || "all";

  section.hidden = !staff.length;
  if (!staff.length) {
    listWrap.innerHTML = `<p class="muted">${staffUi("aboutEmpty")}</p>`;
    return;
  }

  filter.innerHTML = [`<option value="all">${staffUi("aboutAll")}</option>`]
    .concat(positions.map((position) => `<option value="${position}">${position}</option>`))
    .join("");
  filter.value = positions.includes(currentValue) || currentValue === "all" ? currentValue : "all";
  const activeValue = filter.value || "all";
  const filtered = activeValue === "all" ? staff : staff.filter((item) => item.position === activeValue);

  listWrap.innerHTML = filtered.length
    ? `<div class="about-member-grid">${filtered
        .map(
          (item) => `<article class="about-member-card">
            <img src="${item.image || "image/IconLab.png"}" alt="${item.name}" />
            <h5>${item.name}</h5>
            <p class="about-member-position">${item.position || staffUi("positionFallback")}</p>
            <p class="about-member-email">${item.email}</p>
          </article>`
        )
        .join("")}</div>`
    : `<p class="muted">${staffUi("aboutEmpty")}</p>`;
};

const setupHomeAboutSection = () => {
  const filter = byId("labAboutPositionFilter");
  if (!filter) return;
  renderHomeAboutSection();
  if (filter.dataset.bound === "1") return;
  filter.dataset.bound = "1";
  filter.addEventListener("change", () => {
    renderHomeAboutSection();
  });
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
        uploadedImage = await persistImageSource(imageFile, {
          category: "staff",
          filenameBase: byId("labFormManagerName")?.value?.trim() || "manager",
          maxSize: 1200,
          quality: 0.9,
        });
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
      managerImage: uploadedImage || info.managerImage || "image/IconLab.png",
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

const setupResponsibleSelector = () => {
  const box = byId("responsibleOptions");
  const hidden = byId("selectedResponsibleId");
  if (!box || !hidden) return;
  if (box.dataset.bound === "1") {
    renderResponsibleOptions();
    if (typeof renderEqResponsibleOptions === "function") renderEqResponsibleOptions();
    return;
  }

  if (!hidden.value) {
    const first = getResponsibleStaff()[0];
    hidden.value = first?.id || "";
  }
  renderResponsibleOptions();
  if (typeof renderEqResponsibleOptions === "function") renderEqResponsibleOptions();

  box.dataset.bound = "1";
  box.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    const card = target.closest("[data-responsible-id]");
    if (!(card instanceof HTMLElement)) return;
    hidden.value = card.dataset.responsibleId || "";
    renderResponsibleOptions();
    if (typeof renderEqResponsibleOptions === "function") renderEqResponsibleOptions();
  });
};

Object.assign(globalThis, {
  setupHomeBottomEditor,
  getResponsibleStaff,
  getStaffPositions,
  renderResponsibleOptions,
  setupResponsibleSelector,
  renderHomeAboutSection,
  setupHomeAboutSection,
});
