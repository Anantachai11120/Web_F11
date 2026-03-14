const csvEscape = (value) => {
  const text = value == null ? "" : String(value);
  if (/["\n,]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
};

const toCsvText = (columns, rows) => {
  const head = columns.map((c) => csvEscape(c.label)).join(",");
  const body = rows
    .map((row) => columns.map((c) => csvEscape(row[c.key])).join(","))
    .join("\n");
  return [head, body].filter(Boolean).join("\n");
};

const toExcelHtml = (columns, rows, title) => {
  const header = columns.map((c) => `<th>${String(c.label || "")}</th>`).join("");
  const body = rows
    .map(
      (row) =>
        `<tr>${columns
          .map((c) => `<td>${String(row[c.key] == null ? "" : row[c.key])}</td>`)
          .join("")}</tr>`
    )
    .join("");
  return `<!doctype html>
<html><head><meta charset="utf-8" /></head><body>
<table border="1">
<caption>${String(title || "")}</caption>
<thead><tr>${header}</tr></thead>
<tbody>${body}</tbody>
</table>
</body></html>`;
};

const downloadBlobFile = (filename, blob) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1200);
};

const parseDateLikeValue = (value) => {
  if (!value) return null;
  const raw = String(value).trim();
  if (!raw) return null;
  if (/^\d{4}-\d{2}-\d{2}/.test(raw)) {
    const [y, m, d] = raw.slice(0, 10).split("-").map((n) => Number(n));
    if (!y || !m || !d) return null;
    return new Date(y, m - 1, d);
  }
  const dt = new Date(raw);
  if (Number.isNaN(dt.getTime())) return null;
  return dt;
};

const filterRowsByPeriod = (rows, period) => {
  if (!period || period.type === "all") return rows;
  return rows.filter((row) => {
    const dt = parseDateLikeValue(row.__filterDate || row.date || row.createdAt);
    if (!dt) return false;
    const year = dt.getFullYear();
    const monthIndex = dt.getMonth();

    if (period.type === "year") {
      return year === period.year;
    }
    if (period.type === "month") {
      return year === period.year && monthIndex === period.monthIndex;
    }
    if (period.type === "range") {
      const key = year * 12 + monthIndex;
      return key >= period.fromKey && key <= period.toKey;
    }
    return true;
  });
};

const getPeriodFromForm = () => {
  const type = String(byId("adminExportPeriodType")?.value || "all");
  if (type === "all") return { type: "all" };

  if (type === "year") {
    const year = Number(byId("adminExportYear")?.value || 0);
    if (!year) return null;
    return { type, year };
  }

  if (type === "month") {
    const monthRaw = String(byId("adminExportMonth")?.value || "");
    if (!/^\d{4}-\d{2}$/.test(monthRaw)) return null;
    const [year, month] = monthRaw.split("-").map(Number);
    return { type, year, monthIndex: month - 1 };
  }

  const fromRaw = String(byId("adminExportFromMonth")?.value || "");
  const toRaw = String(byId("adminExportToMonth")?.value || "");
  if (!/^\d{4}-\d{2}$/.test(fromRaw) || !/^\d{4}-\d{2}$/.test(toRaw)) return null;
  const [fromYear, fromMonth] = fromRaw.split("-").map(Number);
  const [toYear, toMonth] = toRaw.split("-").map(Number);
  const fromKey = fromYear * 12 + (fromMonth - 1);
  const toKey = toYear * 12 + (toMonth - 1);
  if (fromKey > toKey) return null;
  return { type, fromKey, toKey };
};

const getExportRows = (datasetKey) => {
  const staffMap = new Map(getResponsibleStaff().map((s) => [String(s.id || ""), s]));
  if (datasetKey === "users") {
    const rows = load(storageKeys.users, []).map((u) => ({
      username: u.username || "",
      name: u.name || "",
      email: u.email || "",
      role: u.role || "user",
      verified: u.verified ? "yes" : "no",
      suspended: u.suspended ? "yes" : "no",
      studentId: u.studentId || "",
      year: u.year || "",
      school: u.school || "",
      major: u.major || "",
      phone: u.phone || "",
      createdAt: u.createdAt || "",
      __filterDate: u.createdAt || "",
    }));
    return {
      filenameBase: "users",
      title: t("adminExportDatasetUsers"),
      columns: [
        { key: "username", label: "username" },
        { key: "name", label: "name" },
        { key: "email", label: "email" },
        { key: "role", label: "role" },
        { key: "verified", label: "verified" },
        { key: "suspended", label: "suspended" },
        { key: "studentId", label: "student_id" },
        { key: "year", label: "year" },
        { key: "school", label: "school" },
        { key: "major", label: "major" },
        { key: "phone", label: "phone" },
        { key: "createdAt", label: "created_at" },
      ],
      rows,
    };
  }

  if (datasetKey === "roomBookings") {
    const rows = load(storageKeys.roomBookings, []).map((r) => {
      const responsible = staffMap.get(String(r.responsibleId || ""));
      return {
        bookingId: r.bookingId || "",
        createdAt: r.createdAt || "",
        room: r.room || "Lab-F11",
        date: r.date || "",
        timeSlot: r.timeSlot || "",
        requesterName: r.requesterName || r.name || "",
        username: r.username || "",
        email: r.email || "",
        member1: r.member1 || "",
        member2: r.member2 || "",
        purpose: r.purpose || "",
        status: r.status || "pending",
        approvedBy: r.approvedBy || "",
        responsibleName: responsible?.name || "",
        responsibleEmail: responsible?.email || "",
        __filterDate: r.date || r.createdAt || "",
      };
    });
    return {
      filenameBase: "room-bookings",
      title: t("adminExportDatasetRooms"),
      columns: [
        { key: "bookingId", label: "booking_id" },
        { key: "createdAt", label: "created_at" },
        { key: "room", label: "room" },
        { key: "date", label: "date" },
        { key: "timeSlot", label: "time_slot" },
        { key: "requesterName", label: "requester_name" },
        { key: "username", label: "username" },
        { key: "email", label: "email" },
        { key: "member1", label: "member_1" },
        { key: "member2", label: "member_2" },
        { key: "purpose", label: "purpose" },
        { key: "status", label: "status" },
        { key: "approvedBy", label: "approved_by" },
        { key: "responsibleName", label: "responsible_name" },
        { key: "responsibleEmail", label: "responsible_email" },
      ],
      rows,
    };
  }

  const rows = load(storageKeys.equipmentBookings, []).map((e) => {
    const responsible = staffMap.get(String(e.responsibleId || ""));
    return {
      bookingId: e.bookingId || "",
      createdAt: e.createdAt || "",
      item: e.item || "",
      quantity: e.quantity || "",
      date: e.date || "",
      timeSlot: e.timeSlot || "",
      requesterName: e.requesterName || e.name || "",
      username: e.username || "",
      email: e.email || "",
      detail: e.detail || "",
      returnStatus: e.returnStatus || "borrowed",
      returnRequestedAt: e.returnRequestedAt || "",
      returnedAt: e.returnedAt || "",
      responsibleName: responsible?.name || "",
      responsibleEmail: responsible?.email || "",
      __filterDate: e.date || e.createdAt || "",
    };
  });
  return {
    filenameBase: "equipment-bookings",
    title: t("adminExportDatasetEquipment"),
    columns: [
      { key: "bookingId", label: "booking_id" },
      { key: "createdAt", label: "created_at" },
      { key: "item", label: "item" },
      { key: "quantity", label: "quantity" },
      { key: "date", label: "date" },
      { key: "timeSlot", label: "time_slot" },
      { key: "requesterName", label: "requester_name" },
      { key: "username", label: "username" },
      { key: "email", label: "email" },
      { key: "detail", label: "detail" },
      { key: "returnStatus", label: "return_status" },
      { key: "returnRequestedAt", label: "return_requested_at" },
      { key: "returnedAt", label: "returned_at" },
      { key: "responsibleName", label: "responsible_name" },
      { key: "responsibleEmail", label: "responsible_email" },
    ],
    rows,
  };
};

const setupAdminDataExport = () => {
  if (!isCurrentPage("admin.html")) return;
  const form = byId("adminDataExportForm");
  const notice = byId("adminDataExportNotice");
  const datasetSelect = byId("adminExportDataset");
  if (!form || form.dataset.bound === "1" || !datasetSelect) return;
  form.dataset.bound = "1";
  const periodType = byId("adminExportPeriodType");
  const yearWrap = byId("adminExportYearWrap");
  const monthWrap = byId("adminExportMonthWrap");
  const rangeWrap = byId("adminExportRangeWrap");
  const yearInput = byId("adminExportYear");
  const monthInput = byId("adminExportMonth");
  const fromMonthInput = byId("adminExportFromMonth");
  const toMonthInput = byId("adminExportToMonth");

  const now = new Date();
  const nowYear = now.getFullYear();
  const nowMonthValue = `${nowYear}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  if (yearInput && !yearInput.value) yearInput.value = String(nowYear);
  if (monthInput && !monthInput.value) monthInput.value = nowMonthValue;
  if (fromMonthInput && !fromMonthInput.value) fromMonthInput.value = nowMonthValue;
  if (toMonthInput && !toMonthInput.value) toMonthInput.value = nowMonthValue;

  const syncPeriodUI = () => {
    const mode = String(periodType?.value || "all");
    if (yearWrap) yearWrap.hidden = mode !== "year";
    if (monthWrap) monthWrap.hidden = mode !== "month";
    if (rangeWrap) rangeWrap.hidden = mode !== "range";
  };
  syncPeriodUI();
  periodType?.addEventListener("change", syncPeriodUI);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!requireCapability("data_export_manage")) return;
    const format = String(e.submitter?.dataset?.exportFormat || "csv").toLowerCase();
    const dataset = String(datasetSelect.value || "users");
    const period = getPeriodFromForm();
    if (!period) {
      setNotice(notice, t("adminExportPeriodInvalid"), "error");
      return;
    }
    const pack = getExportRows(dataset);
    const filteredRows = filterRowsByPeriod(pack.rows, period).map((row) => {
      const cloned = { ...row };
      delete cloned.__filterDate;
      return cloned;
    });
    const stamp = new Date().toISOString().slice(0, 10);
    if (format === "excel") {
      const html = toExcelHtml(pack.columns, filteredRows, pack.title);
      const blob = new Blob(["\ufeff", html], {
        type: "application/vnd.ms-excel;charset=utf-8",
      });
      downloadBlobFile(`${pack.filenameBase}-${stamp}.xls`, blob);
      setNotice(notice, t("adminExportDone", { format: "Excel", count: filteredRows.length }));
      return;
    }

    const csv = toCsvText(pack.columns, filteredRows);
    const blob = new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8;" });
    downloadBlobFile(`${pack.filenameBase}-${stamp}.csv`, blob);
    setNotice(notice, t("adminExportDone", { format: "CSV", count: filteredRows.length }));
  });
};

globalThis.setupAdminDataExport = setupAdminDataExport;
