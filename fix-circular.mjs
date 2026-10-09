import { readdirSync, readFileSync, writeFileSync, existsSync, statSync } from "fs";
import { join, sep } from "path";

const candidates = [".vercel/output/functions/__server.func", ".output/server"];
const baseDir = candidates.find((d) => existsSync(join(d, "_ssr")));
if (!baseDir) { console.error("No output found"); process.exit(1); }

// Read esm file to get runtime block and export list
const ssrDir = join(baseDir, "_ssr");
const esmFile = readdirSync(ssrDir).find((f) => f.startsWith("esm-") && f.endsWith(".mjs"));
if (!esmFile) { console.error("esm-*.mjs not found in _ssr"); process.exit(1); }

const esmContent = readFileSync(join(ssrDir, esmFile), "utf-8");

// Extract the runtime block (between rolldown/runtime.js markers)
const runtimeBlockMatch = esmContent.match(/\/\/#region \\0rolldown\/runtime\.js\n([\s\S]*?)\/\/#endregion/);
if (!runtimeBlockMatch) { console.error("Cannot find runtime block"); process.exit(1); }

// The runtime block includes var __create through var __require
const runtimeBlock = runtimeBlockMatch[1].trim();
console.log("Runtime block:", runtimeBlock.length, "bytes");

// Identifiers the runtime block defines (__create, __toESM, __commonJSMin, ...).
// Derive them from the block itself instead of hardcoding the bundler's
// export aliases, which change between versions.
const runtimeDefined = new Set(
  [...runtimeBlock.matchAll(/\bvar\s+(__\w+)/g)].map((m) => m[1]),
);
if (runtimeDefined.size === 0) { console.error("No runtime identifiers found in block"); process.exit(1); }
console.log("Runtime identifiers:", [...runtimeDefined].join(", "));

// The runtime block calls createRequire(import.meta.url)
const needsCreateRequire = "import { createRequire } from \"node:module\";\n";

function processFile(fp) {
  let c;
  try { c = readFileSync(fp, "utf-8"); } catch { return false; }

  // Match import from the esm file (with relative path)
  // Handles: "../../_ssr/esm-xxx.mjs", "../_ssr/esm-xxx.mjs", "./esm-xxx.mjs"
  const re = /import\s*\{([\s\S]*?)\}\s*from\s*"((?:\.\.?\/)*(?:_ssr\/)?esm-\w+\.mjs)";\n?/;
  const m = c.match(re);
  if (!m) return false;

  const items = m[1].split(",").map(s => s.trim()).filter(Boolean);
  const path = m[2];

  // A runtime identifier is imported when the LOCAL binding name (the part
  // after `as`) matches something the inline block defines. These are dropped
  // from the import (and instead provided by the inlined block) to avoid both
  // the circular-init bug and duplicate declarations.
  let usesRuntime = false;
  const nonRuntimeItems = [];
  for (const item of items) {
    const parts = item.split(/\s+as\s+/);
    const local = (parts[1] ?? parts[0]).trim();
    if (runtimeDefined.has(local)) usesRuntime = true;
    else nonRuntimeItems.push(item);
  }
  if (!usesRuntime) return false;

  // Remove old import
  c = c.replace(re, "");

  // Build replacement (add createRequire only if the file doesn't have it)
  const hasCreateRequire = /import\s*\{\s*createRequire\s*\}\s*from\s*"node:module"/.test(c);
  let head = (hasCreateRequire ? "" : needsCreateRequire) + runtimeBlock + "\n";

  if (nonRuntimeItems.length > 0) {
    head += "import {" + nonRuntimeItems.join(", ") + "} from \"" + path + "\";\n";
  }

  c = head + c.trimStart();
  c = c.replace(/\n{3,}/g, "\n\n");
  writeFileSync(fp, c);
  return true;
}

function* walk(dir) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (e.endsWith(".mjs")) yield p;
  }
}

let count = 0;
// Process _libs first (they import from ../_ssr/ or ../../_ssr/)
for (const fp of walk(join(baseDir, "_libs"))) {
  if (processFile(fp)) { count++; console.log("  libs/" + fp.replace(baseDir + sep + "_libs" + sep, "").replace(/\\/g, "/")); }
}
// Then _ssr (they import from ./esm-xxx.mjs)
for (const fp of walk(join(baseDir, "_ssr"))) {
  if (processFile(fp)) { count++; console.log("  ssr/" + fp.replace(baseDir + sep + "_ssr" + sep, "").replace(/\\/g, "/")); }
}

console.log("Done: " + count + " files patched");
