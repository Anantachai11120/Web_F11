const seedHomeInfo = () => {
  const exists = localStorage.getItem(storageKeys.homeInfo);
  if (exists) return;
  save(storageKeys.homeInfo, defaultHomeInfo);
};

const seedResponsibleStaff = () => {
  const exists = localStorage.getItem(storageKeys.responsibleStaff);
  if (exists) return;
  save(storageKeys.responsibleStaff, defaultResponsibleStaff);
};

const seedEquipmentItems = () => {
  const exists = localStorage.getItem(storageKeys.equipmentItems);
  if (exists) return;
  save(storageKeys.equipmentItems, defaultEquipmentItems);
};

const seedEquipmentTypes = () => {
  const exists = localStorage.getItem(storageKeys.equipmentTypes);
  if (exists) return;
  save(storageKeys.equipmentTypes, defaultEquipmentTypes);
};

const getEquipmentItemsBase =
  typeof getEquipmentItems === "function"
    ? getEquipmentItems
    : () => load(storageKeys.equipmentItems, defaultEquipmentItems);

const getResponsibleStaffBase =
  typeof getResponsibleStaff === "function"
    ? getResponsibleStaff
    : () => load(storageKeys.responsibleStaff, defaultResponsibleStaff);

const normalizeEquipmentItemsBase =
  typeof normalizeEquipmentItems === "function"
    ? normalizeEquipmentItems
    : () =>
        getEquipmentItemsBase().map((it, idx) => ({
          id: it.id || `eq-${idx + 1}`,
          name: it.name || `Item ${idx + 1}`,
          nameEn: String(it.nameEn || "").trim(),
          image: it.image || "image/IconLab.png",
          stock: Math.max(1, Number(it.stock || 1)),
          type: it.type || "ทั่วไป",
          usageGuide: String(it.usageGuide || "").trim(),
        }));

const normalizeEquipmentBookingsData = () => {
  const list = load(storageKeys.equipmentBookings, []);
  if (!Array.isArray(list) || !list.length) return;
  const staff = getResponsibleStaffBase();
  const defaultResponsibleId = staff[0]?.id || "";
  const items = normalizeEquipmentItemsBase();
  let changed = false;
  const normalized = list.map((b) => {
    const next = { ...b };
    if (!next.bookingId) {
      next.bookingId = `eqb-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      changed = true;
    }
    if (!next.room) {
      next.room = "Lab-F11";
      changed = true;
    }
    if (!next.returnStatus) {
      next.returnStatus = "borrowed";
      changed = true;
    }
    if (!next.responsibleId) {
      next.responsibleId = defaultResponsibleId;
      changed = true;
    }
    if (!next.itemId && next.item) {
      const hit = items.find((i) => i.name === next.item);
      if (hit) {
        next.itemId = hit.id;
        changed = true;
      }
    }
    return next;
  });
  if (changed) save(storageKeys.equipmentBookings, normalized);
};

const migrateLegacyData = () => {
  const targetVersion = 3;
  const meta = load(storageKeys.meta, { version: 0 });
  if (Number(meta.version || 0) >= targetVersion) return;

  const staff = load(storageKeys.responsibleStaff, defaultResponsibleStaff);
  const defaultResponsibleId = staff[0]?.id || "";

  const roomBookings = load(storageKeys.roomBookings, []).map((b) => {
    const requesterName = b.requesterName || b.name || "";
    const participantCount =
      Number(
        b.participantCount ||
        [requesterName, b.member1 || "", b.member2 || ""].filter(Boolean).length ||
        1
      );
    return {
      ...b,
      requesterName,
      name: requesterName,
      room: b.room || "Lab-F11",
      bookingId: b.bookingId || `bk-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      participantCount,
      responsibleId: b.responsibleId || defaultResponsibleId,
      status: b.status || "pending",
    };
  });
  save(storageKeys.roomBookings, roomBookings);

  const users = load(storageKeys.users, []).map((u) => ({
    ...u,
    studentId: u.studentId || "",
    year: u.year || "",
    school: u.school || "",
    major: u.major || "",
    phone: u.phone || "",
    profileImage: u.profileImage || "",
  }));
  save(storageKeys.users, users);

  const equipmentBookings = load(storageKeys.equipmentBookings, []).map((b) => ({
    ...b,
    bookingId: b.bookingId || `eqb-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timeSlot: b.timeSlot || "",
    room: b.room || "Lab-F11",
    responsibleId: b.responsibleId || defaultResponsibleId,
    returnStatus: b.returnStatus || "borrowed",
  }));
  save(storageKeys.equipmentBookings, equipmentBookings);

  const items = load(storageKeys.equipmentItems, []);
  if (!Array.isArray(items) || !items.length) {
    save(storageKeys.equipmentItems, defaultEquipmentItems);
  } else {
    save(
      storageKeys.equipmentItems,
      items.map((it, idx) => ({
        id: it.id || `eq-${idx + 1}`,
        name: it.name || `Item ${idx + 1}`,
        image: it.image || "image/IconLab.png",
        stock: Math.max(1, Number(it.stock || 1)),
        type: it.type || "ทั่วไป",
      }))
    );
  }

  const types = load(storageKeys.equipmentTypes, []);
  if (!Array.isArray(types) || !types.length) {
    save(storageKeys.equipmentTypes, defaultEquipmentTypes);
  } else {
    const normalizedTypes = [...new Set(types.map((v) => String(v || "").trim()).filter(Boolean))];
    if (!normalizedTypes.length) normalizedTypes.push(...defaultEquipmentTypes);
    save(storageKeys.equipmentTypes, normalizedTypes);
  }

  save(storageKeys.meta, { version: targetVersion, migratedAt: new Date().toISOString() });
};

const syncResponsibleApprovals = async () => {
  try {
    const res = await fetch('/api/confirmed-bookings');
    if (!res.ok) return;
    const body = await res.json();
    if (!Array.isArray(body.items)) return;
    const map = new Map(body.items.map((i) => [i.bookingId, i]));
    const list = load(storageKeys.roomBookings, []);
    let changed = false;
    list.forEach((b) => {
      const hit = map.get(b.bookingId);
      if (!hit) return;
      if (b.status !== hit.status) {
        b.status = hit.status;
        if (hit.status === 'approved') {
          b.approvedBy = hit.approvedBy || 'responsible';
          b.approvedAt = hit.approvedAt || new Date().toISOString();
        } else if (hit.status === 'rejected') {
          b.rejectedBy = hit.rejectedBy || 'responsible';
          b.rejectedAt = hit.rejectedAt || new Date().toISOString();
        }
        changed = true;
      }
    });
    if (changed) save(storageKeys.roomBookings, list);
  } catch {
    // API may be unavailable when static host is used.
  }
};

const updateVisitorCounters = () => {
  const page = location.pathname.split("/").pop() || "index.html";
  if (page !== "index.html") return;

  const today = new Date().toISOString().slice(0, 10);
  const marker = `lab_visit_counted_${today}`;
  const info = { ...defaultHomeInfo, ...load(storageKeys.homeInfo, defaultHomeInfo) };

  if (info.visitorsDate !== today) {
    info.visitorsDate = today;
    info.visitorsToday = 0;
  }

  if (!sessionStorage.getItem(marker)) {
    info.visitorsTotal = Number(info.visitorsTotal || 0) + 1;
    info.visitorsToday = Number(info.visitorsToday || 0) + 1;
    sessionStorage.setItem(marker, "1");
    save(storageKeys.homeInfo, info);
  }
};

const seedAdmin = () => {
  const users = load(storageKeys.users, []);
  const adminUsername = "Anantachai2000";
  const hasAdmin = users.some((u) => u.username === adminUsername);
  if (hasAdmin) return;

  users.push({
    name: "System Admin",
    username: adminUsername,
    email: "anantachai2000@labflow.local",
    password: "Wave_862543",
    verified: true,
    verificationCode: "000000",
    role: "admin",
    roomQuotaDaily: 1,
    roomQuotaWeekly: 3,
  });
  save(storageKeys.users, users);
};

const seedDemoUser = () => {
  const users = load(storageKeys.users, []);
  const demoUsername = "demo_user_f11";
  const hasDemo = users.some((u) => u.username === demoUsername);
  if (hasDemo) return;

  users.push({
    name: "Demo User F11",
    username: demoUsername,
    email: "demo.user.f11@labflow.local",
    password: "Demo_123456",
    verified: true,
    verificationCode: "111111",
    role: "user",
    studentId: "DEMO001",
    year: "3",
    school: "วิศวกรรมศาสตร์",
    major: "วิศวกรรมเมคคาทรอนิกส์",
    phone: "0800000000",
    roomQuotaDaily: 1,
    roomQuotaWeekly: 3,
  });
  save(storageKeys.users, users);
};

const normalizeUsers = () => {
  const users = load(storageKeys.users, []);
  const normalized = users.map((u) => ({
    ...u,
    username: u.username || (u.email ? u.email.split("@")[0] : "user"),
    role: u.role || "user",
    roomQuotaDaily: Math.max(1, Number(u.roomQuotaDaily || 1)),
    roomQuotaWeekly: Math.max(1, Number(u.roomQuotaWeekly || 3)),
  }));
  save(storageKeys.users, normalized);
};
