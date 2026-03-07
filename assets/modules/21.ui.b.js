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

