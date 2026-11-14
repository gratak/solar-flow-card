// Every option documented in the README's tables must be settable in the
// visual editor (src/80-editor.js). Section ids and theme names are listed in
// the README too, but are not options.
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const readme = readFileSync(join(root, "README.md"), "utf8");
const editor = readFileSync(join(root, "src", "80-editor.js"), "utf8");
const header = readFileSync(join(root, "src", "00-header.js"), "utf8");
const sections = readFileSync(join(root, "src", "40-sections.js"), "utf8");

const themes = JSON.parse(header.match(/const THEMES = (\[[^\]]+\])/)[1]);
const sectionIds = [...sections.matchAll(/^\s+([a-z_]+): [a-zA-Z]+Html,$/gm)].map((m) => m[1]).concat(["flow", "today", "sources"]);
const notOptions = new Set([...themes, ...sectionIds, "custom_1", "type"]);

const keys = [...new Set([...readme.matchAll(/^\| `([a-z_]+)`/gm)].map((m) => m[1]))].filter((key) => !notOptions.has(key));
const missing = keys.filter((key) => !new RegExp(`[.\"'\`\\[]${key}\\b(?![-_])`).test(editor));
for (const key of missing) console.log(`  ✗ ${key}: documented in the README but not in the editor`);
console.log(`${keys.length - missing.length}/${keys.length} options in the editor`);
process.exit(missing.length ? 1 : 0);
