/**
 * Copy the built OpenShorts dashboard into public/app and re-apply the app
 * shell patches the Vite build wipes out:
 *  - noindex (the shell is not a crawlable page)
 *  - the hash-router pin on <head>, keeping the query string so a
 *    Pollinations OAuth ?code= callback survives before React mounts
 *
 * Usage: node scripts/sync-app.mjs [path-to-dashboard-dist]
 */
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const dist = path.resolve(process.argv[2] || "../../openshorts/dashboard/dist");
const target = path.resolve("public/app");
const PIN = '<script>if(!/^#\\/?app/.test(location.hash))history.replaceState(null,"",location.pathname+location.search+"#app")</script>';

await rm(path.join(target, "assets"), { recursive: true, force: true });
await mkdir(target, { recursive: true });
await cp(path.join(dist, "assets"), path.join(target, "assets"), { recursive: true });
for (const entry of ["index.html", "fonts", "fonts.css", "logo-clippingai.svg"]) {
  await cp(path.join(dist, entry), path.join(target, entry), { recursive: true }).catch(() => {});
}

const file = path.join(target, "index.html");
let html = await readFile(file, "utf8");
html = html
  .replace(/^[ \t]*<meta name="robots" content="index, follow[^>]*>\n/m, "")
  .replace(/^  <meta name="robots" content="noindex, follow" \/>\n/m, "")
  .replace(/<script>if\(!\^#\\\/\?app[\s\S]*?<\/script>\n/m, "");

html = html.replace(
  '<meta name="viewport"',
  '<meta name="robots" content="noindex, follow" />\n  <meta name="viewport"',
);
html = html.replace(
  "<head>\n",
  "<head>\n  <!-- App shell, not a crawlable page; the pin keeps ?code= for the OAuth callback. -->\n  " + PIN + "\n",
);

await writeFile(file, html);
console.log(`synced ${path.relative(process.cwd(), target)} from ${dist}`);
