import fs from "fs";
import path from "path";

const ROOT = process.cwd();

const stripScripts = (html) =>
  html.replace(/<script[\s\S]*?<\/script>/gi, "");

const rewriteLegacyLinks = (html) => {
  const routeMap = {
    "index.html": "/",
    "rooms.html": "/rooms",
    "equipment.html": "/equipment",
    "login.html": "/login",
    "register.html": "/register",
    "verify.html": "/verify",
    "profile.html": "/profile",
    "admin.html": "/admin",
  };
  let out = html;
  Object.entries(routeMap).forEach(([legacy, nextRoute]) => {
    const re = new RegExp(`(href=["'])${legacy}(["'])`, "gi");
    out = out.replace(re, `$1${nextRoute}$2`);
  });
  return out;
};

const extractBody = (html) => {
  const match = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  return match ? match[1] : html;
};

export const readLegacyBodyHtml = (fileName) => {
  const filePath = path.join(ROOT, fileName);
  const raw = fs.readFileSync(filePath, "utf8");
  const body = extractBody(raw);
  return rewriteLegacyLinks(stripScripts(body));
};
