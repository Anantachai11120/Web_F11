import Head from "next/head";
import Script from "next/script";

export default function LegacyPageFrame({ title, bodyHtml }) {
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
      <div dangerouslySetInnerHTML={{ __html: bodyHtml || "" }} />
      <Script src="/assets/app.js" strategy="afterInteractive" />
    </>
  );
}
