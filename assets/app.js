(() => {
  const version = "20260317-01";
  const page = String(document.documentElement?.dataset?.page || "").trim() || "index";

  const commonParts = [
    "/assets/modules/00.data.config.js",
    "/assets/modules/01.data.i18n.js",
    "/assets/modules/02.data.static.js",
    "/assets/modules/10.core.a.js",
    "/assets/modules/11.core.b.js",
  ];

  const pageParts = {
    index: [
      "/assets/modules/20.ui.a.js",
      "/assets/modules/21.ui.b.js",
      "/assets/modules/22.ui.lab-projects.js",
      "/assets/modules/40.bootstrap.js",
    ],
    rooms: [
      "/assets/modules/12.booking.auth.js",
      "/assets/modules/20.ui.a.js",
      "/assets/modules/21.ui.b.js",
      "/assets/modules/24.ui.room-slot-expand.js",
      "/assets/modules/25.ui.room-zone-map.js",
      "/assets/modules/30.api.a.js",
      "/assets/modules/31.api.b.js",
      "/assets/modules/40.bootstrap.js",
    ],
    equipment: [
      "/assets/modules/12.booking.auth.js",
      "/assets/modules/21.ui.b.js",
      "/assets/modules/22.ui.eq-booking.js",
      "/assets/modules/23.ui.c.js",
      "/assets/modules/30.api.a.js",
      "/assets/modules/40.bootstrap.js",
    ],
    profile: [
      "/assets/modules/20.ui.a.js",
      "/assets/modules/23.ui.c.js",
      "/assets/modules/40.bootstrap.js",
    ],
    login: [
      "/assets/modules/30.api.a.js",
      "/assets/modules/40.bootstrap.js",
    ],
    register: [
      "/assets/modules/30.api.a.js",
      "/assets/modules/40.bootstrap.js",
    ],
    verify: [
      "/assets/modules/30.api.a.js",
      "/assets/modules/40.bootstrap.js",
    ],
    admin: [
      "/assets/modules/20.ui.a.js",
      "/assets/modules/21.ui.b.js",
      "/assets/modules/22.ui.eq-booking.js",
      "/assets/modules/22.ui.lab-projects.js",
      "/assets/modules/23.ui.c.js",
      "/assets/modules/25.ui.room-zone-map.js",
      "/assets/modules/30.api.a.js",
      "/assets/modules/31.api.b.js",
      "/assets/modules/32.api.export.js",
      "/assets/modules/40.bootstrap.js",
    ],
  };

  const parts = [...commonParts, ...(pageParts[page] || pageParts.index)];

  parts.forEach((part) => {
    const script = document.createElement("script");
    script.src = `${part}?v=${version}`;
    script.async = false;
    script.onerror = () => {
      console.error(`Failed to load ${part}`);
    };
    document.head.appendChild(script);
  });
})();

