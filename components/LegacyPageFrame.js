import Head from "next/head";
import Script from "next/script";

export default function LegacyPageFrame({ title, bodyHtml }) {
  const appVersion = "20260317-05";
  const sanitizedBodyHtml = String(bodyHtml || "")
    .replace(/<link[^>]+href=["']assets\/style\.css[^>]*>\s*/gi, "")
    .replace(/<script[^>]+src=["']assets\/app\.js[^>]*><\/script>\s*/gi, "");
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
            else if (path === "/about" || path.endsWith("/about.html")) pageName = "about";
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
            root.dataset.role = loggedIn
              ? ((session && session.role === "admin")
                ? "admin"
                : ((session && session.role === "teacher") ? "teacher" : "user"))
              : "guest";

            var dict = isEn ? {
              brandName: "UNDERGROUND LAB F11",
              navHome: "Home",
              navRooms: "Room Booking",
              navEquipment: "Equipment Booking",
              navAbout: "About Us",
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
              brandName: "แล็ปชั้นใต้ดิน F11",
              navHome: "หน้าหลัก",
              navRooms: "จองห้อง",
              navEquipment: "จองอุปกรณ์",
              navAbout: "เกี่ยวกับเรา",
              navProfile: "โปรไฟล์",
              navAdmin: "แอดมิน",
              navLogin: loggedIn ? "ออกจากระบบ" : "เข้าสู่ระบบ",
              homeLabTitle: "เกี่ยวกับห้องปฏิบัติการ UNDERGROUND LAB F11",
              roomRulesHeroTitle: "กฎการใช้งานห้องปฏิบัติการ Lab-F11",
              equipmentHeroTitle: "จองอุปกรณ์ห้องปฏิบัติการ",
              roomRequesterSectionTitle: "ข้อมูลผู้ขอใช้งาน",
              roomStatusSectionTitle: "สถานะการจอง",
              equipmentBookingFormTitle: "แบบฟอร์มจองอุปกรณ์",
              equipmentListTitle: "รายการอุปกรณ์"
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

            var ensureInitialProfileMiniMenu = function () {
              try {
                if (!loggedIn) return false;
                var nav = document.querySelector(".nav");
                if (!nav) return false;
                var shell = nav.querySelector(".nav-profile-shell");
                if (!shell) {
                  shell = document.createElement("div");
                  shell.className = "nav-profile-shell";
                  shell.innerHTML =
                    '<button type="button" class="nav-profile-trigger" aria-haspopup="menu" aria-expanded="false">' +
                      '<img class="nav-profile-avatar" src="' + (session && session.profileImage ? session.profileImage : "image/IconLab.png") + '" alt="' + ((session && (session.name || session.username)) || "profile") + '" />' +
                    "</button>" +
                    '<div class="nav-profile-dropdown" role="menu">' +
                      '<button type="button" class="nav-profile-item" data-profile-menu="profile" role="menuitem">' + (isEn ? "Profile" : "โปรไฟล์") + "</button>" +
                      '<button type="button" class="nav-profile-item danger" data-profile-menu="logout" role="menuitem">' + (isEn ? "Logout" : "ออกจากระบบ") + "</button>" +
                    "</div>";
                  nav.appendChild(shell);
                } else {
                  shell.hidden = false;
                  var avatar = shell.querySelector(".nav-profile-avatar");
                  if (avatar) {
                    avatar.src = (session && session.profileImage) ? session.profileImage : "image/IconLab.png";
                    avatar.alt = (session && (session.name || session.username)) || "profile";
                  }
                }
                return true;
              } catch (e) {
                return false;
              }
            };

            var syncInitialBookingUi = function () {
              try {
                var isRooms = pageName === "rooms";
                var isEquipment = pageName === "equipment";
                if (!isRooms && !isEquipment) return;

                if (isRooms) {
                  var roomCard = document.getElementById("roomBookingCard");
                  var roomGrid = document.getElementById("roomMainGrid");
                  var roomLegendMine = document.getElementById("roomLegendMine");
                  var roomBookingTab = document.querySelector('[data-room-tab="booking"]');
                  var roomStatusTab = document.querySelector('[data-room-tab="status"]');
                  if (roomCard) roomCard.hidden = !loggedIn;
                  if (roomLegendMine) roomLegendMine.hidden = !loggedIn;
                  if (roomBookingTab) roomBookingTab.hidden = !loggedIn;
                  if (roomStatusTab) roomStatusTab.hidden = !loggedIn;
                  if (roomGrid) roomGrid.classList.toggle("single-col", !loggedIn);
                }

                if (isEquipment) {
                  var eqCard = document.getElementById("equipmentBookingCard");
                  var eqGrid = document.getElementById("equipmentMainGrid");
                  if (eqCard) eqCard.hidden = !loggedIn;
                  if (eqGrid) eqGrid.classList.toggle("single-col", !loggedIn);
                }
              } catch (e) {}
            };

            var syncInitialAdminUi = function () {
              try {
                if (pageName !== "admin") return;
                var isTeacher = root.dataset.role === "teacher";
                var roleTab = document.querySelector('[data-admin-tab="adminRole"]');
                var roleTitle = document.querySelector('[data-admin-panel="adminRole"] h2');
                var roleHint = document.querySelector('[data-admin-panel="adminRole"] [data-i18n="adminRoleHint"]');
                if (isTeacher) {
                  if (roleTab) roleTab.textContent = isEn ? "Permissions" : "จัดการสิทธิ์";
                  if (roleTitle) roleTitle.textContent = isEn ? "Permissions" : "จัดการสิทธิ์";
                  if (roleHint) {
                    roleHint.textContent = isEn
                      ? "View profiles, suspend users temporarily, and manage quota."
                      : "ดูโปรไฟล์ผู้ใช้ ระงับผู้ใช้ชั่วคราว และจัดการโควต้า";
                  }
                }
              } catch (e) {}
            };

            var applyQuickI18n = function () {
              var nodes = document.querySelectorAll("[data-i18n]");
              if (!nodes.length) return false;
              for (var i = 0; i < nodes.length; i++) {
                var key = nodes[i].getAttribute("data-i18n");
                if (key && dict[key]) {
                  var label = nodes[i].querySelector ? nodes[i].querySelector(".nav-label") : null;
                  if (label) label.textContent = dict[key];
                  else nodes[i].textContent = dict[key];
                }
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
            var profileAttempts = 0;
            var profileTick = function () {
              profileAttempts += 1;
              if (ensureInitialProfileMiniMenu() || profileAttempts >= 60) return;
              requestAnimationFrame(profileTick);
            };
            requestAnimationFrame(profileTick);
            if (document.readyState === "loading") {
              document.addEventListener("DOMContentLoaded", function () {
                syncNavAndLangUi();
                ensureInitialProfileMiniMenu();
                syncInitialBookingUi();
                syncInitialAdminUi();
              }, { once: true });
            } else {
              syncNavAndLangUi();
              ensureInitialProfileMiniMenu();
              syncInitialBookingUi();
              syncInitialAdminUi();
            }
            window.setTimeout(syncNavAndLangUi, 0);
            window.setTimeout(syncNavAndLangUi, 120);
            window.setTimeout(ensureInitialProfileMiniMenu, 0);
            window.setTimeout(ensureInitialProfileMiniMenu, 120);
            window.setTimeout(syncInitialBookingUi, 0);
            window.setTimeout(syncInitialBookingUi, 120);
            window.setTimeout(syncInitialAdminUi, 0);
            window.setTimeout(syncInitialAdminUi, 120);
          } catch (e) {}
        })();
      `}</Script>
      <div dangerouslySetInnerHTML={{ __html: sanitizedBodyHtml }} />
      <Script src={`/assets/app.js?v=${appVersion}`} strategy="afterInteractive" />
    </>
  );
}

