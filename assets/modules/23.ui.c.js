const equipmentReturnStatusLabel = (status) => {
  if (status === "returned") return t("equipmentReturnStatusReturned");
  if (status === "return_requested") return t("equipmentReturnStatusRequested");
  return t("equipmentReturnStatusBorrowed");
};

const responsibleCropState = {
  image: null,
  zoom: 1,
  offsetX: 0,
  offsetY: 0,
  croppedDataUrl: "",
};

const responsibleUi = (key) => {
  const dict = getLang() === "th"
    ? {
        cropEmpty: "ยังไม่ได้เลือกรูปบุคลากร",
        cropPending: "เลือกรูปแล้ว ปรับกรอบและกดครอปได้",
        cropReady: "ครอปรูปบุคลากรแล้ว",
        imageRequired: "กรุณาใส่รูปบุคลากรอย่างน้อย 1 แบบ",
        positionRequired: "กรุณาเลือกตำแหน่งบุคลากร",
        positionAdded: "เพิ่มหมวดหมู่ตำแหน่งแล้ว",
        positionExists: "หมวดหมู่นี้มีอยู่แล้ว",
        positionDeleteBlocked: "ไม่สามารถลบหมวดหมู่ที่มีบุคลากรใช้งานอยู่",
      }
    : {
        cropEmpty: "No staff image selected.",
        cropPending: "Image loaded. Adjust and crop it.",
        cropReady: "Staff image cropped.",
        imageRequired: "Please provide a staff image.",
        positionRequired: "Please choose a position.",
        positionAdded: "Position category added.",
        positionExists: "This position category already exists.",
        positionDeleteBlocked: "Cannot delete a position that is already in use.",
      };
  return dict[key] || key;
};

const drawResponsibleCropCanvas = () => {
  const canvas = byId("responsibleCropCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#f5fbfd";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  if (!responsibleCropState.image) {
    ctx.fillStyle = "#8fa1b2";
    ctx.font = "14px sans-serif";
    ctx.fillText("No Image", 12, 24);
    return;
  }
  const img = responsibleCropState.image;
  const scale = Math.max(canvas.width / img.width, canvas.height / img.height) * responsibleCropState.zoom;
  const drawW = img.width * scale;
  const drawH = img.height * scale;
  const dx = (canvas.width - drawW) / 2 + responsibleCropState.offsetX;
  const dy = (canvas.height - drawH) / 2 + responsibleCropState.offsetY;
  ctx.drawImage(img, dx, dy, drawW, drawH);
};

const createResponsibleCroppedDataUrl = () => {
  const canvas = byId("responsibleCropCanvas");
  if (!canvas || !responsibleCropState.image) return "";
  return canvas.toDataURL("image/jpeg", 0.9);
};

const setupResponsibleCropTool = () => {
  const input = byId("responsibleImageFile");
  const zoom = byId("responsibleCropZoom");
  const x = byId("responsibleCropX");
  const y = byId("responsibleCropY");
  const applyBtn = byId("applyResponsibleCropBtn");
  const status = byId("responsibleCropStatus");
  if (!input || !zoom || !x || !y || !applyBtn || !status) return;
  if (input.dataset.bound === "1") return;
  input.dataset.bound = "1";

  const setStatus = (msg) => { status.textContent = msg; };
  const redraw = () => {
    responsibleCropState.zoom = Number(zoom.value || 1);
    responsibleCropState.offsetX = Number(x.value || 0);
    responsibleCropState.offsetY = Number(y.value || 0);
    drawResponsibleCropCanvas();
  };

  input.addEventListener("change", () => {
    const file = input.files?.[0];
    responsibleCropState.croppedDataUrl = "";
    if (!file) {
      responsibleCropState.image = null;
      drawResponsibleCropCanvas();
      setStatus(responsibleUi("cropEmpty"));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        responsibleCropState.image = img;
        responsibleCropState.zoom = 1;
        responsibleCropState.offsetX = 0;
        responsibleCropState.offsetY = 0;
        zoom.value = "1";
        x.value = "0";
        y.value = "0";
        drawResponsibleCropCanvas();
        setStatus(responsibleUi("cropPending"));
      };
      img.src = String(reader.result || "");
    };
    reader.readAsDataURL(file);
  });

  [zoom, x, y].forEach((el) => el.addEventListener("input", redraw));

  applyBtn.addEventListener("click", () => {
    responsibleCropState.croppedDataUrl = createResponsibleCroppedDataUrl();
    setStatus(responsibleCropState.croppedDataUrl ? responsibleUi("cropReady") : responsibleUi("imageRequired"));
  });

  drawResponsibleCropCanvas();
  setStatus(responsibleUi("cropEmpty"));
};

const renderResponsiblePositionOptions = (selected = "") => {
  const select = byId("responsiblePosition");
  if (!select) return;
  const positions = getStaffPositions();
  select.innerHTML = positions.map((position) => `<option value="${position}">${position}</option>`).join("");
  if (selected && positions.includes(selected)) select.value = selected;
  else if (positions.length) select.value = positions[0];
};

const renderResponsiblePositionList = () => {
  const wrap = byId("responsiblePositionList");
  if (!wrap) return;
  const positions = getStaffPositions();
  wrap.innerHTML = positions
    .map((position) => `<span class="staff-position-chip">${position}<button type="button" data-delete-staff-position="${position}" aria-label="delete ${position}">${t("deleteBtn")}</button></span>`)
    .join("");
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
                <p class="muted">${s.position || "-"}</p>
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
  const addPositionBtn = byId("addResponsiblePositionBtn");
  const positionInput = byId("responsiblePositionName");
  if (!form) return;
  setupResponsibleCropTool();
  renderResponsiblePositionOptions();
  renderResponsiblePositionList();
  renderResponsibleAdminList();

  if (addPositionBtn && !addPositionBtn.dataset.bound) {
    addPositionBtn.dataset.bound = "1";
    addPositionBtn.addEventListener("click", () => {
      if (!requireCapability("responsible_manage")) return;
      const notice = byId("responsibleNotice");
      const value = String(positionInput?.value || "").trim();
      if (!value) return;
      const positions = getStaffPositions();
      if (positions.includes(value)) {
        setNotice(notice, responsibleUi("positionExists"), "error");
        return;
      }
      save(storageKeys.staffPositions, [...positions, value]);
      if (positionInput) positionInput.value = "";
      renderResponsiblePositionOptions(value);
      renderResponsiblePositionList();
      renderHomeAboutSection();
      setNotice(notice, responsibleUi("positionAdded"));
    });
  }

  if (!form.dataset.bound) {
    form.dataset.bound = "1";
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!requireCapability("responsible_manage")) return;
      const name = byId("responsibleName").value.trim();
      const position = String(byId("responsiblePosition")?.value || "").trim();
      const email = byId("responsibleEmail").value.trim().toLowerCase();
      const imageUrl = byId("responsibleImageUrl").value.trim();
      const file = byId("responsibleImageFile")?.files?.[0];
      const notice = byId("responsibleNotice");
      if (!name || !email) {
        setNotice(notice, t("fillAll"), "error");
        return;
      }
      if (!position) {
        setNotice(notice, responsibleUi("positionRequired"), "error");
        return;
      }
      if (!imageUrl && !file && !responsibleCropState.croppedDataUrl) {
        setNotice(notice, responsibleUi("imageRequired"), "error");
        return;
      }
      let image = responsibleCropState.croppedDataUrl || imageUrl || "image/IconLab.png";
      if (!responsibleCropState.croppedDataUrl && file) {
        try {
          image = await persistImageSource(file, {
            category: "staff",
            filenameBase: name || "staff",
            maxSize: 1200,
            quality: 0.9,
          });
        } catch {
          image = imageUrl || "image/IconLab.png";
        }
      } else if (responsibleCropState.croppedDataUrl) {
        try {
          image = await persistImageSource(responsibleCropState.croppedDataUrl, {
            category: "staff",
            filenameBase: name || "staff",
            maxSize: 1200,
            quality: 0.9,
          });
        } catch {
          image = imageUrl || "image/IconLab.png";
        }
      }

      const list = getResponsibleStaff();
      list.push({
        id: `staff-${Date.now()}`,
        name,
        position,
        email,
        image,
      });
      save(storageKeys.responsibleStaff, list);
      setNotice(notice, t("responsibleSaved"));
      form.reset();
      responsibleCropState.image = null;
      responsibleCropState.croppedDataUrl = "";
      const zoom = byId("responsibleCropZoom");
      const x = byId("responsibleCropX");
      const y = byId("responsibleCropY");
      if (zoom) zoom.value = "1";
      if (x) x.value = "0";
      if (y) y.value = "0";
      drawResponsibleCropCanvas();
      const cropStatus = byId("responsibleCropStatus");
      if (cropStatus) cropStatus.textContent = responsibleUi("cropEmpty");
      renderResponsiblePositionOptions();
      renderResponsiblePositionList();
      renderResponsibleAdminList();
      renderResponsibleOptions();
      renderEqResponsibleOptions();
      renderBroadcastRecipientList();
      renderHomeAboutSection();
    });
  }
};

Object.assign(globalThis, {
  renderResponsibleAdminList,
  renderResponsiblePositionOptions,
  renderResponsiblePositionList,
  setupResponsibleAdmin,
});

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
                <p><strong>${item.name}</strong>${item.nameEn ? ` <span class="muted">/ ${item.nameEn}</span>` : ""}</p>
                <p class="muted">${t("equipmentTypeLabel")}: ${item.type || "ทั่วไป"}</p>
                <p class="muted">${item.usageGuide ? item.usageGuide : t("equipmentUsageEmpty")}</p>
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
  const typeList = byId("eqAdminTypeList");

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

  const renderEquipmentTypeList = () => {
    if (!typeList) return;
    const types = normalizeEquipmentTypes();
    typeList.innerHTML = types
      .map(
        (type) =>
          `<span class="staff-position-chip">${type}<button type="button" data-delete-equipment-type="${type}" aria-label="delete ${type}">${t("deleteBtn")}</button></span>`
      )
      .join("");
  };

  if (!isAdminSession()) {
    tools.hidden = true;
    return;
  }
  tools.hidden = false;
  body.hidden = true;
  toggleBtn.textContent = t("toggleShowEdit");
  renderEquipmentTypeOptions();
  renderEquipmentTypeList();
  renderEquipmentAdminList();

  if (!toggleBtn.dataset.bound) {
    toggleBtn.dataset.bound = "1";
    toggleBtn.addEventListener("click", () => {
      body.hidden = !body.hidden;
      toggleBtn.textContent = body.hidden ? t("toggleShowEdit") : t("toggleHideEdit");
    });
  }

  if (addTypeBtn && addTypeBtn.dataset.bound !== "1") {
    addTypeBtn.dataset.bound = "1";
    addTypeBtn.addEventListener("click", () => {
      if (!requireAdminAction()) return;
      const value = String(newTypeInput?.value || "").trim();
      if (!value) return;
      const types = normalizeEquipmentTypes();
      if (!types.includes(value)) {
        types.push(value);
        save(storageKeys.equipmentTypes, types);
      }
      renderEquipmentTypeOptions(value);
      renderEquipmentTypeList();
      renderEquipmentTypeFilterOptions();
      renderEquipmentCatalog();
      if (newTypeInput) newTypeInput.value = "";
    });
  }

  if (!form.dataset.bound) {
    form.dataset.bound = "1";
    form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!requireAdminAction()) return;
    const notice = byId("equipmentAdminNotice");
    const name = byId("eqAdminName")?.value?.trim() || "";
    const nameEn = byId("eqAdminNameEn")?.value?.trim() || "";
    const type = byId("eqAdminType")?.value?.trim() || "ทั่วไป";
    const usageGuide = byId("eqAdminUsage")?.value?.trim() || "";
    if (!name) {
      setNotice(notice, t("fillAll"), "error");
      return;
    }
    const list = normalizeEquipmentItems();
    const existing = editingEquipmentId ? list.find((i) => i.id === editingEquipmentId) : null;
    const stock = Math.max(1, Number(byId("eqAdminStock")?.value || existing?.stock || 1));
    let image = equipmentCropState.croppedDataUrl || existing?.image || "";
    if (!image) {
      setNotice(notice, t("equipmentAdminImageRequired"), "error");
      return;
    }
    if (equipmentCropState.croppedDataUrl) {
      try {
        image = await persistImageSource(equipmentCropState.croppedDataUrl, {
          category: "equipment",
          filenameBase: name || "equipment",
          maxSize: 1400,
          quality: 0.9,
        });
      } catch {
        setNotice(notice, t("equipmentAdminImageRequired"), "error");
        return;
      }
    }
    if (editingEquipmentId) {
      const index = list.findIndex((i) => i.id === editingEquipmentId);
      if (index >= 0) list[index] = { ...list[index], name, nameEn, image, stock, type, usageGuide };
    } else {
      list.push({
        id: `eq-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name,
        nameEn,
        image,
        stock,
        type,
        usageGuide,
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
  }

  const adminList = byId("equipmentAdminList");
  if (adminList && adminList.dataset.bound !== "1") {
    adminList.dataset.bound = "1";
    adminList.addEventListener("click", (e) => {
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
        if (byId("eqAdminNameEn")) byId("eqAdminNameEn").value = item.nameEn || "";
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
        return;
      }

    });
  }

  if (typeList && typeList.dataset.bound !== "1") {
    typeList.dataset.bound = "1";
    typeList.addEventListener("click", (e) => {
      if (!requireAdminAction()) return;
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      if (target.dataset.deleteEquipmentType === undefined) return;
      const type = String(target.dataset.deleteEquipmentType || "").trim();
      if (!type) return;
      const items = normalizeEquipmentItems();
      if (items.some((item) => String(item.type || "").trim() === type)) {
        setNotice(
          byId("equipmentAdminNotice"),
          getLang() === "th" ? "ไม่สามารถลบชนิดอุปกรณ์ที่กำลังถูกใช้งานอยู่" : "Cannot delete an equipment type that is in use.",
          "error"
        );
        return;
      }
      save(storageKeys.equipmentTypes, normalizeEquipmentTypes().filter((item) => item !== type));
      renderEquipmentTypeOptions();
      renderEquipmentTypeList();
      renderEquipmentTypeFilterOptions();
      renderEquipmentCatalog();
    });
  }
};



