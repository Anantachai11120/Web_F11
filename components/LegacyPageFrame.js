import Head from "next/head";
import Script from "next/script";

export default function LegacyPageFrame({ title, bodyHtml }) {
  const appVersion = "20260307-8";
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Mitr:wght@300;400;500&family=Nunito:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" type="image/png" href="/image/IconLab.png" />
        <link rel="shortcut icon" type="image/png" href="/image/IconLab.png" />
        <link rel="apple-touch-icon" href="/image/IconLab.png" />
        <link rel="stylesheet" href="/assets/style.css" />
      </Head>
      <Script id="boot-state" strategy="beforeInteractive">{`
        (function () {
          try {
            var root = document.documentElement;
            root.classList.remove("i18n-ready");
            var lang = localStorage.getItem("lab_lang");
            var isEn = lang === "en";
            root.lang = isEn ? "en" : "th";
            root.dataset.langPref = isEn ? "en" : "th";
            var path = (location.pathname || "").toLowerCase();
            var pageName = "";
            if (path === "/equipment" || path.endsWith("/equipment.html")) pageName = "equipment";
            else if (path === "/rooms" || path.endsWith("/rooms.html")) pageName = "rooms";
            else if (path === "/profile" || path.endsWith("/profile.html")) pageName = "profile";
            else if (path === "/admin" || path.endsWith("/admin.html")) pageName = "admin";
            else if (path === "/login" || path.endsWith("/login.html")) pageName = "login";
            else if (path === "/register" || path.endsWith("/register.html")) pageName = "register";
            else if (path === "/verify" || path.endsWith("/verify.html")) pageName = "verify";
            else pageName = "index";
            root.dataset.page = pageName;
            var raw = localStorage.getItem("lab_session");
            var session = null;
            try { session = raw ? JSON.parse(raw) : null; } catch (e) {}
            var loggedIn = !!(session && session.username);
            root.dataset.auth = loggedIn ? "in" : "out";

            var dict = isEn ? {
              brandName: "UNDERGROUND LAB F11",
              navHome: "Home",
              navRooms: "Room Booking",
              navEquipment: "Equipment Booking",
              navProfile: "Profile",
              navAdmin: "Admin",
              navLogin: loggedIn ? "Logout" : "Login",
              homeLabTitle: "About UNDERGROUND LAB F11",
              roomRulesHeroTitle: "Lab-F11 Room Usage Rules",
              equipmentHeroTitle: "Lab Equipment Booking",
              roomRequesterSectionTitle: "Requester Information",
              roomStatusSectionTitle: "Booking Status",
              equipmentBookingFormTitle: "Equipment Booking Form",
              equipmentListTitle: "Equipment List"
            } : {};

            var applyQuickI18n = function () {
              var nodes = document.querySelectorAll("[data-i18n]");
              if (!nodes.length) return false;
              for (var i = 0; i < nodes.length; i++) {
                var key = nodes[i].getAttribute("data-i18n");
                if (key && dict[key]) nodes[i].textContent = dict[key];
              }
              return true;
            };

            if (!applyQuickI18n()) {
              var attempts = 0;
              var maxAttempts = 60;
              var tick = function () {
                attempts += 1;
                if (applyQuickI18n() || attempts >= maxAttempts) return;
                requestAnimationFrame(tick);
              };
              requestAnimationFrame(tick);
            }
          } catch (e) {}
        })();
      `}</Script>
      <div dangerouslySetInnerHTML={{ __html: bodyHtml || "" }} />
      <Script src={`/assets/app.js?v=${appVersion}`} strategy="afterInteractive" />
    </>
  );
}
