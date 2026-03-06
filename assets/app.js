(() => {
  const parts = [
    "/assets/app.00.data.js",
    "/assets/app.01.core.js",
    "/assets/app.02.ui.js",
    "/assets/app.03.api.js",
    "/assets/app.04.bootstrap.js",
  ];

  const loadPart = (index) => {
    if (index >= parts.length) return;
    const script = document.createElement("script");
    script.src = parts[index];
    script.async = false;
    script.onload = () => loadPart(index + 1);
    script.onerror = () => {
      console.error(`Failed to load ${parts[index]}`);
    };
    document.head.appendChild(script);
  };

  loadPart(0);
})();
