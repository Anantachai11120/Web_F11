import Head from "next/head";
import Script from "next/script";

export default function LegacyPageFrame({ title, bodyHtml }) {
  const appVersion = "20260306-4";
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
            root.classList.add("app-booting");
            var lang = localStorage.getItem("lab_lang");
            root.lang = lang === "en" ? "en" : "th";
            var raw = localStorage.getItem("lab_session");
            var session = null;
            try { session = raw ? JSON.parse(raw) : null; } catch (e) {}
            root.dataset.auth = session && session.username ? "in" : "out";
          } catch (e) {}
          setTimeout(function () {
            try { document.documentElement.classList.remove("app-booting"); } catch (e) {}
          }, 1800);
        })();
      `}</Script>
      <div dangerouslySetInnerHTML={{ __html: bodyHtml || "" }} />
      <Script src={`/assets/app.js?v=${appVersion}`} strategy="afterInteractive" />
    </>
  );
}
