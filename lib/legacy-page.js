import fs from "fs";
import path from "path";

const ROOT = process.cwd();

const stripScripts = (html) =>
  html.replace(/<script[\s\S]*?<\/script>/gi, "");

const extractBody = (html) => {
  const match = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  return match ? match[1] : html;
};

export const readLegacyBodyHtml = (fileName) => {
  const filePath = path.join(ROOT, fileName);
  const raw = fs.readFileSync(filePath, "utf8");
  const body = extractBody(raw);
  return stripScripts(body);
};

