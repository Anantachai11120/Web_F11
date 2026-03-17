let labProjectsSliderTimer = null;
let labProjectsSliderIndex = 0;
let labProjectsSliderRenderIndex = 0;
const labProjectCropState = {
  image: null,
  zoom: 1,
  offsetX: 0,
  offsetY: 0,
  croppedDataUrl: "",
};
const LAB_PROJECT_EXPORT_WIDTH = 1920;
const LAB_PROJECT_EXPORT_HEIGHT = 1080;

const labProjectText = () =>
  getLang() === "th"
    ? {
        homeTitle: "ผลงานแลป",
        homeHint: "ตัวอย่างผลงานและต้นแบบที่พัฒนาภายในห้องปฏิบัติการ เลื่อนอัตโนมัติและหยุดเมื่อโฮเวอร์",
        empty: "ยังไม่มีผลงานแลป",
        by: "ผู้จัดทำ: {{author}}",
        adminTitle: "เพิ่มผลงานแลป",
        titleLabel: "หัวข้อผลงาน",
        titlePlaceholder: "เช่น หุ่นยนต์ติดตามเส้นอัตโนมัติ",
        authorLabel: "ผู้จัดทำ",
        authorPlaceholder: "เช่น ทีมระบบอัตโนมัติ รุ่น 2026",
        imageLabel: "ภาพผลงาน",
        contentLabel: "รายละเอียดผลงาน",
        contentPlaceholder: "อธิบายแนวคิด วิธีการใช้งาน หรือผลลัพธ์เด่นของผลงาน",
        saveBtn: "บันทึกผลงาน",
        listTitle: "รายการผลงานแลป",
        missing: "กรอกข้อมูลผลงานให้ครบและใส่ภาพผลงาน",
        saved: "บันทึกผลงานแลปเรียบร้อย",
        confirmDelete: "ยืนยันลบผลงานนี้ใช่หรือไม่?",
      }
    : {
        homeTitle: "Lab Projects",
        homeHint: "Selected lab projects and prototypes. Auto-scrolls and pauses on hover.",
        empty: "No lab projects yet.",
        by: "By: {{author}}",
        adminTitle: "Add Lab Projects",
        titleLabel: "Project title",
        titlePlaceholder: "e.g. Autonomous line-following robot",
        authorLabel: "Author",
        authorPlaceholder: "e.g. Automation Team 2026",
        imageLabel: "Project image",
        contentLabel: "Project details",
        contentPlaceholder: "Describe the concept, usage, or notable outcomes of this project",
        saveBtn: "Save project",
        listTitle: "Lab project list",
        missing: "Please complete project fields and attach an image.",
        saved: "Lab project saved.",
        confirmDelete: "Confirm deleting this project?",
      };
const labProjectUi = (key, vars = {}) => {
  let out = labProjectText()[key] || key;
  Object.keys(vars).forEach((name) => {
    out = out.replaceAll(`{{${name}}}`, String(vars[name]));
  });
  return out;
};

const renderLabProjectsText = () => {
  const setText = (id, value) => {
    const el = byId(id);
    if (el) el.textContent = value;
  };
  const setPlaceholder = (id, value) => {
    const el = byId(id);
    if (el) el.placeholder = value;
  };
  setText("labProjectsTitle", labProjectUi("homeTitle"));
  setText("labProjectsHint", labProjectUi("homeHint"));
  setText("adminLabProjectsTitle", labProjectUi("adminTitle"));
  setText("adminLabProjectTitleLabel", labProjectUi("titleLabel"));
  setText("adminLabProjectAuthorLabel", labProjectUi("authorLabel"));
  setText("adminLabProjectImageLabel", labProjectUi("imageLabel"));
  setText("adminLabProjectContentLabel", labProjectUi("contentLabel"));
  setText("adminSaveLabProjectBtn", labProjectUi("saveBtn"));
  setText("adminLabProjectListTitle", labProjectUi("listTitle"));
  setPlaceholder("labProjectTitle", labProjectUi("titlePlaceholder"));
  setPlaceholder("labProjectAuthor", labProjectUi("authorPlaceholder"));
  setPlaceholder("labProjectContent", labProjectUi("contentPlaceholder"));
};

const normalizeLabProject = (project, index = 0) => {
  const item = project && typeof project === "object" ? project : {};
  return {
    id: String(item.id || `lab-project-${Date.now()}-${index}`).trim(),
    title: String(item.title || "").trim(),
    author: String(item.author || "").trim(),
    content: String(item.content || "").trim(),
    image: String(item.image || "").trim(),
    createdAt: String(item.createdAt || new Date().toISOString()).trim(),
  };
};

const getLabProjects = () => {
  const raw = load(storageKeys.labProjects, []);
  let changed = false;
  const normalized = raw.map((project, index) => {
    const next = normalizeLabProject(project, index);
    if (
      next.id !== project?.id ||
      next.title !== project?.title ||
      next.author !== project?.author ||
      next.content !== project?.content ||
      next.image !== project?.image ||
      next.createdAt !== project?.createdAt
    ) {
      changed = true;
    }
    return next;
  });
  if (changed) save(storageKeys.labProjects, normalized);
  return normalized.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
};

const drawLabProjectCropCanvas = () => {
  const canvas = byId("labProjectCropCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#f7fbfc";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  if (!labProjectCropState.image) return;

  const img = labProjectCropState.image;
  const baseScale = Math.max(canvas.width / img.width, canvas.height / img.height);
  const drawScale = baseScale * labProjectCropState.zoom;
  const drawW = img.width * drawScale;
  const drawH = img.height * drawScale;
  const dx = (canvas.width - drawW) / 2 + labProjectCropState.offsetX;
  const dy = (canvas.height - drawH) / 2 + labProjectCropState.offsetY;
  ctx.drawImage(img, dx, dy, drawW, drawH);
};

const renderLabProjectCropToCanvas = (canvas, quality = 0.93) => {
  if (!canvas || !labProjectCropState.image) return "";
  const previewCanvas = byId("labProjectCropCanvas");
  const previewW = Math.max(1, Number(previewCanvas?.width || 360));
  const previewH = Math.max(1, Number(previewCanvas?.height || 220));
  const targetW = Math.max(1, Number(canvas.width || LAB_PROJECT_EXPORT_WIDTH));
  const targetH = Math.max(1, Number(canvas.height || LAB_PROJECT_EXPORT_HEIGHT));
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";
  ctx.clearRect(0, 0, targetW, targetH);
  ctx.fillStyle = "#f7fbfc";
  ctx.fillRect(0, 0, targetW, targetH);

  const img = labProjectCropState.image;
  const baseScale = Math.max(targetW / img.width, targetH / img.height);
  const drawScale = baseScale * labProjectCropState.zoom;
  const drawW = img.width * drawScale;
  const drawH = img.height * drawScale;
  const offsetX = labProjectCropState.offsetX * (targetW / previewW);
  const offsetY = labProjectCropState.offsetY * (targetH / previewH);
  const dx = (targetW - drawW) / 2 + offsetX;
  const dy = (targetH - drawH) / 2 + offsetY;
  ctx.drawImage(img, dx, dy, drawW, drawH);
  return canvas.toDataURL("image/jpeg", quality);
};

const createLabProjectCroppedDataUrl = () => {
  const canvas = document.createElement("canvas");
  canvas.width = LAB_PROJECT_EXPORT_WIDTH;
  canvas.height = LAB_PROJECT_EXPORT_HEIGHT;
  return renderLabProjectCropToCanvas(canvas, 0.94);
};

const shrinkLabProjectImageDataUrl = (dataUrl, maxLength = 320000) =>
  new Promise((resolve) => {
    if (!dataUrl || typeof dataUrl !== "string" || !dataUrl.startsWith("data:image/")) {
      resolve("");
      return;
    }
    if (dataUrl.length <= maxLength) {
      resolve(dataUrl);
      return;
    }
    const img = new Image();
    img.onload = () => {
      let scale = 1;
      let quality = 0.92;
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(dataUrl.slice(0, maxLength));
        return;
      }
      for (let attempt = 0; attempt < 8; attempt += 1) {
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        canvas.width = w;
        canvas.height = h;
        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        const next = canvas.toDataURL("image/jpeg", quality);
        if (next.length <= maxLength || attempt === 7) {
          resolve(next);
          return;
        }
        scale *= 0.94;
        quality = Math.max(0.72, quality - 0.03);
      }
      resolve(dataUrl);
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });

const updateLabProjectCropStatus = () => {
  const status = byId("labProjectCropStatus");
  if (!status) return;
  if (labProjectCropState.croppedDataUrl) {
    status.textContent = getLang() === "th" ? "ครอปภาพผลงานแล้ว" : "Project image cropped.";
    return;
  }
  if (labProjectCropState.image) {
    status.textContent = getLang() === "th" ? "เลือกรูปแล้ว ระบบจะใช้ภาพนี้อัตโนมัติ หรือกดครอปเพื่อจัดเฟรม" : "Image loaded. It will be used automatically, or crop it to frame the slide.";
    return;
  }
  status.textContent = getLang() === "th" ? "ยังไม่ได้เลือกรูปผลงาน" : "No project image selected.";
};

const resetLabProjectCropTool = () => {
  labProjectCropState.image = null;
  labProjectCropState.zoom = 1;
  labProjectCropState.offsetX = 0;
  labProjectCropState.offsetY = 0;
  labProjectCropState.croppedDataUrl = "";
  const zoom = byId("labProjectCropZoom");
  const x = byId("labProjectCropX");
  const y = byId("labProjectCropY");
  if (zoom) zoom.value = "1";
  if (x) x.value = "0";
  if (y) y.value = "0";
  drawLabProjectCropCanvas();
  updateLabProjectCropStatus();
};

const setupLabProjectCropTool = () => {
  const fileInput = byId("labProjectImage");
  const zoom = byId("labProjectCropZoom");
  const x = byId("labProjectCropX");
  const y = byId("labProjectCropY");
  const applyBtn = byId("applyLabProjectCropBtn");
  if (!fileInput || !zoom || !x || !y || !applyBtn || fileInput.dataset.cropBound) return;
  fileInput.dataset.cropBound = "1";

  const redraw = () => {
    labProjectCropState.zoom = Number(zoom.value || 1);
    labProjectCropState.offsetX = Number(x.value || 0);
    labProjectCropState.offsetY = Number(y.value || 0);
    drawLabProjectCropCanvas();
  };

  [zoom, x, y].forEach((input) => input.addEventListener("input", redraw));

  fileInput.addEventListener("change", () => {
    labProjectCropState.croppedDataUrl = "";
    const file = fileInput.files?.[0];
    if (!file) {
      resetLabProjectCropTool();
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        labProjectCropState.image = img;
        labProjectCropState.zoom = 1;
        labProjectCropState.offsetX = 0;
        labProjectCropState.offsetY = 0;
        zoom.value = "1";
        x.value = "0";
        y.value = "0";
        drawLabProjectCropCanvas();
        labProjectCropState.croppedDataUrl = createLabProjectCroppedDataUrl();
        updateLabProjectCropStatus();
      };
      img.src = String(reader.result || "");
    };
    reader.readAsDataURL(file);
  });

  applyBtn.addEventListener("click", () => {
    labProjectCropState.croppedDataUrl = createLabProjectCroppedDataUrl();
    updateLabProjectCropStatus();
  });

  drawLabProjectCropCanvas();
  updateLabProjectCropStatus();
};

const stopLabProjectsSlider = () => {
  if (labProjectsSliderTimer) {
    window.clearInterval(labProjectsSliderTimer);
    labProjectsSliderTimer = null;
  }
};

const updateLabProjectsSlider = (target, projects, nextIndex) => {
  if (!target) return;
  const total = projects.length;
  if (!total) return;
  const track = target.querySelector(".lab-projects-track");
  if (!track) return;
  const safeIndex = ((nextIndex % total) + total) % total;
  labProjectsSliderIndex = safeIndex;
  labProjectsSliderRenderIndex = nextIndex;

  if (nextIndex >= total) {
    labProjectsSliderRenderIndex = total;
    track.style.transform = `translateX(-${total * 100}%)`;
  } else if (nextIndex < 0) {
    labProjectsSliderRenderIndex = total - 1;
    track.style.transform = `translateX(-${(total - 1) * 100}%)`;
  } else {
    track.style.transform = `translateX(-${nextIndex * 100}%)`;
  }

  target.querySelectorAll("[data-lab-project-dot]").forEach((dot, index) => {
    dot.classList.toggle("active", index === safeIndex);
    dot.setAttribute("aria-current", index === safeIndex ? "true" : "false");
  });
};

const startLabProjectsSlider = (target, projects) => {
  stopLabProjectsSlider();
  if (!target || projects.length <= 1) return;
  labProjectsSliderTimer = window.setInterval(() => {
    updateLabProjectsSlider(target, projects, labProjectsSliderIndex + 1);
  }, 4600);
};

const bindLabProjectsSlider = (target, projects) => {
  if (!target) return;
  const viewport = target.querySelector(".lab-projects-viewport");
  if (!viewport) return;

  if (!viewport.dataset.bound) {
    viewport.dataset.bound = "1";
    viewport.addEventListener("mouseenter", () => stopLabProjectsSlider());
    viewport.addEventListener("mouseleave", () => startLabProjectsSlider(target, projects));
  }

  const track = target.querySelector(".lab-projects-track");
  if (track && !track.dataset.boundLoop) {
    track.dataset.boundLoop = "1";
    track.addEventListener("transitionend", () => {
      if (labProjectsSliderRenderIndex !== projects.length) return;
      track.classList.add("no-motion");
      labProjectsSliderRenderIndex = 0;
      labProjectsSliderIndex = 0;
      track.style.transform = "translateX(0)";
      void track.offsetWidth;
      track.classList.remove("no-motion");
      target.querySelectorAll("[data-lab-project-dot]").forEach((dot, index) => {
        dot.classList.toggle("active", index === 0);
        dot.setAttribute("aria-current", index === 0 ? "true" : "false");
      });
    });
  }

  target.querySelectorAll("[data-lab-project-dot]").forEach((dot) => {
    if (dot.dataset.bound) return;
    dot.dataset.bound = "1";
    dot.addEventListener("click", () => {
      const index = Number(dot.dataset.labProjectDot || 0);
      updateLabProjectsSlider(target, projects, index);
      startLabProjectsSlider(target, projects);
    });
  });

  target.querySelectorAll("[data-lab-project-nav]").forEach((btn) => {
    if (btn.dataset.bound) return;
    btn.dataset.bound = "1";
    btn.addEventListener("click", () => {
      const direction = String(btn.dataset.labProjectNav || "next");
      const baseIndex =
        labProjectsSliderRenderIndex >= projects.length ? 0 : labProjectsSliderIndex;
      updateLabProjectsSlider(target, projects, baseIndex + (direction === "prev" ? -1 : 1));
      startLabProjectsSlider(target, projects);
    });
  });
};

const renderLabProjects = () => {
  renderLabProjectsText();
  stopLabProjectsSlider();
  const target = byId("labProjectsWrap");
  if (!target) return;
  const projects = getLabProjects();
  if (!projects.length) {
    target.innerHTML = `<p class="muted">${labProjectUi("empty")}</p>`;
    return;
  }

  labProjectsSliderIndex = Math.min(labProjectsSliderIndex, Math.max(projects.length - 1, 0));
  labProjectsSliderRenderIndex = labProjectsSliderIndex;
  target.innerHTML = `
    <div class="lab-projects-viewport">
      ${
        projects.length > 1
          ? `<div class="lab-projects-nav">
              <button type="button" class="lab-project-nav-btn" data-lab-project-nav="prev" aria-label="Previous project">&#8249;</button>
              <button type="button" class="lab-project-nav-btn" data-lab-project-nav="next" aria-label="Next project">&#8250;</button>
            </div>`
          : ""
      }
      <div class="lab-projects-track">
        ${projects
          .map(
            (project) => `
              <article class="lab-project-card">
                ${
                  project.image
                    ? `<img class="lab-project-image" src="${project.image}" alt="${project.title}" />`
                    : `<div class="lab-project-image lab-project-image-fallback"></div>`
                }
                <div class="lab-project-overlay">
                  <p class="feed-meta">${new Date(project.createdAt).toLocaleDateString(localeByLang())}</p>
                  <h3>${project.title || "-"}</h3>
                  <p class="lab-project-author">${labProjectUi("by", { author: project.author || "-" })}</p>
                  <p class="lab-project-content">${project.content || "-"}</p>
                </div>
              </article>
            `
          )
          .join("")}
        ${
          projects.length > 1
            ? `
              <article class="lab-project-card" aria-hidden="true">
                ${
                  projects[0].image
                    ? `<img class="lab-project-image" src="${projects[0].image}" alt="${projects[0].title}" />`
                    : `<div class="lab-project-image lab-project-image-fallback"></div>`
                }
                <div class="lab-project-overlay">
                  <p class="feed-meta">${new Date(projects[0].createdAt).toLocaleDateString(localeByLang())}</p>
                  <h3>${projects[0].title || "-"}</h3>
                  <p class="lab-project-author">${labProjectUi("by", { author: projects[0].author || "-" })}</p>
                  <p class="lab-project-content">${projects[0].content || "-"}</p>
                </div>
              </article>
            `
            : ""
        }
      </div>
    </div>
    ${
      projects.length > 1
        ? `<div class="lab-projects-dots" aria-label="Lab project slider indicators">
            ${projects
              .map(
                (_project, index) => `
                  <button
                    type="button"
                    class="lab-project-dot${index === labProjectsSliderIndex ? " active" : ""}"
                    data-lab-project-dot="${index}"
                    aria-label="Slide ${index + 1}"
                    aria-current="${index === labProjectsSliderIndex ? "true" : "false"}"
                  ></button>
                `
              )
              .join("")}
          </div>`
        : ""
    }
  `;

  updateLabProjectsSlider(target, projects, labProjectsSliderIndex);
  bindLabProjectsSlider(target, projects);
  startLabProjectsSlider(target, projects);
};

const renderAdminLabProjects = () => {
  renderLabProjectsText();
  const target = byId("adminLabProjectList");
  if (!target) return;
  const projects = getLabProjects();
  target.innerHTML = projects.length
    ? `<div class="admin-announce-grid">${projects
        .map(
          (project) => `
            <div class="admin-announce-card">
              ${project.image ? `<img class="feed-image" src="${project.image}" alt="${project.title}" />` : ""}
              <p class="admin-announce-title"><strong>${project.title || "-"}</strong></p>
              <p class="admin-announce-type"><span class="pill approved">${project.author || "-"}</span></p>
              <p class="muted admin-announce-content">${project.content || "-"}</p>
              <p class="muted admin-announce-meta">${new Date(project.createdAt).toLocaleString(localeByLang())}</p>
              <div class="feed-actions-end">
                <button type="button" class="btn-small danger" data-delete-lab-project="${project.id}">${t("deleteBtn")}</button>
              </div>
            </div>
          `
        )
        .join("")}</div>`
    : `<p class="muted">${t("adminLabProjectEmpty")}</p>`;

  if (!target.dataset.bound) {
    target.dataset.bound = "1";
    target.addEventListener("click", (event) => {
      const targetBtn = event.target;
      if (!(targetBtn instanceof HTMLElement)) return;
      const deleteBtn = targetBtn.closest("[data-delete-lab-project]");
      if (!(deleteBtn instanceof HTMLElement)) return;
      if (!requireCapability("announcement_manage")) return;
      if (!window.confirm(labProjectUi("confirmDelete"))) return;
      const projectId = String(deleteBtn.dataset.deleteLabProject || "").trim();
      if (!projectId) return;
      const next = getLabProjects().filter((project) => project.id !== projectId);
      save(storageKeys.labProjects, next);
      renderAdminLabProjects();
      renderLabProjects();
    });
  }
};

const setupLabProjectsAdmin = () => {
  const form = byId("labProjectForm");
  if (!form || form.dataset.bound) return;
  setupLabProjectCropTool();
  form.dataset.bound = "1";
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!requireCapability("announcement_manage")) return;
    const notice = byId("adminLabProjectNotice");
    const title = String(byId("labProjectTitle")?.value || "").trim();
    const author = String(byId("labProjectAuthor")?.value || "").trim();
    const content = String(byId("labProjectContent")?.value || "").trim();
    const file = byId("labProjectImage")?.files?.[0];
    if (!title || !author || !content || !file) {
      setNotice(notice, labProjectUi("missing"), "error");
      return;
    }
    let image = String(labProjectCropState.croppedDataUrl || "").trim();
    if (!image) {
      try {
        image = createLabProjectCroppedDataUrl() || (await optimizeImageFileToDataUrl(file, 1280, 0.9));
      } catch {
        setNotice(notice, t("imageRequired"), "error");
        return;
      }
    }
    image = await shrinkLabProjectImageDataUrl(image);
    if (!image) {
      setNotice(notice, t("imageRequired"), "error");
      return;
    }
    try {
      image = await persistImageSource(image, {
        category: "projects",
        filenameBase: title || "project",
        maxSize: 1920,
        quality: 0.92,
      });
    } catch {
      setNotice(notice, t("imageRequired"), "error");
      return;
    }
    const list = getLabProjects();
    list.push(
      normalizeLabProject({
        id: `lab-project-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        title,
        author,
        content,
        image,
        createdAt: new Date().toISOString(),
      })
    );
    save(storageKeys.labProjects, list);
    form.reset();
    resetLabProjectCropTool();
    setNotice(notice, labProjectUi("saved"));
    labProjectsSliderIndex = 0;
    renderAdminLabProjects();
    renderLabProjects();
  });
};

Object.assign(globalThis, {
  renderLabProjects,
  renderAdminLabProjects,
  setupLabProjectsAdmin,
});
