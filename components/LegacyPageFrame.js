import Head from "next/head";
import Script from "next/script";

export default function LegacyPageFrame({ title, bodyHtml }) {
  const appVersion = "20260307-18";
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
        <link rel="stylesheet" href={`/assets/style.css?v=${appVersion}`} />
      </Head>
      <Script id="boot-state" strategy="beforeInteractive">{`
        (function () {
          try {
            var root = document.documentElement;
            var lang = localStorage.getItem("lab_lang");
            var isEn = lang === "en";
            root.lang = isEn ? "en" : "th";
            root.dataset.langPref = isEn ? "en" : "th";
            if (isEn) root.classList.remove("i18n-ready");
            else root.classList.add("i18n-ready");
            if (isEn) {
              window.setTimeout(function () {
                if (!root.classList.contains("i18n-ready")) root.classList.add("i18n-ready");
              }, 2500);
            }
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
            root.dataset.role = loggedIn ? ((session && session.role === "admin") ? "admin" : "user") : "guest";

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
            } : {
              navLogin: loggedIn ? "ออกจากระบบ" : "เข้าสู่ระบบ"
            };

            var syncNavAndLangUi = function () {
              try {
                var selects = document.querySelectorAll("#languageSelect");
                for (var s = 0; s < selects.length; s++) {
                  selects[s].value = isEn ? "en" : "th";
                }
                var loginLinks = document.querySelectorAll('.nav a[data-i18n="navLogin"]');
                for (var j = 0; j < loginLinks.length; j++) {
                  var link = loginLinks[j];
                  if (dict.navLogin) link.textContent = dict.navLogin;
                  if (loggedIn) link.classList.add("logout-pill");
                  else link.classList.remove("logout-pill");
                }
                root.classList.add("lang-ready");
              } catch (e) {}
            };

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
            if (document.readyState === "loading") {
              document.addEventListener("DOMContentLoaded", syncNavAndLangUi, { once: true });
            } else {
              syncNavAndLangUi();
            }
            window.setTimeout(syncNavAndLangUi, 0);
            window.setTimeout(syncNavAndLangUi, 120);
          } catch (e) {}
        })();
      `}</Script>
      <div dangerouslySetInnerHTML={{ __html: bodyHtml || "" }} />
      <Script src={`/assets/app.js?v=${appVersion}`} strategy="afterInteractive" />
    </>
  );
}
