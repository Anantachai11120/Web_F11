(() => {
  const version = "20260307-8";
  const parts = [
    "/assets/app.00.data.js",
    "/assets/app.01.core.js",
    "/assets/app.02.ui.js",
    "/assets/app.03.api.js",
    "/assets/app.04.bootstrap.js",
  ];

  // Insert all scripts immediately so browser can fetch in parallel,
  // while keeping execution order with async=false.
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
