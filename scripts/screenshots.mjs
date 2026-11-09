// Renders the demo page and saves one screenshot per theme into docs/.
// Usage: node scripts/screenshots.mjs [scenario] [language]
// Needs Playwright (set PLAYWRIGHT_MODULE to its index.mjs if not installed locally).
import http from "node:http";
import { existsSync, readFileSync, mkdirSync } from "node:fs";
import { join, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || "playwright");
const [scenario = "afternoon", language = "pl", period = "today"] = process.argv.slice(2);
const types = { ".js": "text/javascript; charset=utf-8", ".html": "text/html; charset=utf-8" };
const server = http.createServer((req, res) => {
  if (req.url === "/favicon.ico") { res.writeHead(204); return res.end(); }
  const file = join(root, decodeURIComponent(req.url.split("?")[0]));
  if (!existsSync(file)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "content-type": types[extname(file)] || "application/octet-stream" });
  res.end(readFileSync(file));
}).listen(0);
const port = server.address().port;
const out = process.env.OUT || join(root, "docs");
mkdirSync(out, { recursive: true });
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const errors = [];
for (const theme of (process.env.THEMES || "diorama,aurora,paper,lcars,atlantis,expanse,foundation,galaxy,gate,reactor").split(",")) {
  const page = await browser.newPage({ viewport: { width: Number(process.env.WIDTH ?? 520) + 80, height: 1200 }, deviceScaleFactor: 2 });
  page.on("pageerror", (e) => errors.push(`${theme}: ${e.message}`));
  page.on("console", (m) => { if (m.type() === "error") errors.push(`${theme}: ${m.text()}`); });
  await page.goto(`http://localhost:${port}/demo/index.html?theme=${theme}&scenario=${scenario}&language=${language}&period=${period}&solar=${process.env.SOLAR ?? "1"}&battery=${process.env.BATTERY ?? "1"}&weather=${process.env.WEATHER ?? ""}&wide=${process.env.WIDE ?? "0"}&panels=${process.env.PANELS ?? "opt"}&width=${process.env.WIDTH ?? "520"}`);
  await page.waitForFunction(() => window.demoReady);
  await page.waitForTimeout(1500);
  const card = page.locator("home-energy-hub").first();
  await card.screenshot({ path: join(out, `${theme}.png`) });
  await page.close();
}
await browser.close();
server.close();
if (errors.length) { console.error(errors.join("\n")); process.exitCode = 1; }
else console.log(`screenshots written to ${out}`);
