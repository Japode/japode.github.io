// Checks the built site against the roadmap's "done when" lines, so a regression fails
// the build instead of shipping. Run after scripts/prerender.mjs:
//
//   node scripts/verify.mjs
//
// Each check names the task it holds. It reads dist/ and the sources, nothing else.

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs"
import { dirname, join, relative, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import * as app from "../dist-server/entry-server.js"

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const DIST = join(REPO, "dist")
const { SITE, ROUTES } = app
const failures = []
const check = (task, ok, what) => {
  if (!ok) failures.push(`${task}: ${what}`)
}

const walk = (dir) => readdirSync(dir).flatMap((f) => (statSync(join(dir, f)).isDirectory() ? walk(join(dir, f)) : [join(dir, f)]))
const read = (path) => readFileSync(join(DIST, path), "utf8")
// React separates adjacent text with <!-- -->; a check reads the text a visitor sees
const page = (route) => read(join(app.outputDir(route), "index.html")).replaceAll("<!-- -->", "")
const html = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
const pages = walk(DIST).filter((f) => f.endsWith(".html"))

// JP1 — every route is static HTML that reads without JavaScript, born on the final
// origin, with the mark as favicon and the manifest beside it.
check("JP1", SITE.origin === "https://japode.com", `the canonical origin is ${SITE.origin}, not https://japode.com`)
for (const r of ROUTES) {
  const file = join(app.outputDir(r.path), "index.html")
  check("JP1", existsSync(join(DIST, file)), `${r.path} was not prerendered`)
  if (!existsSync(join(DIST, file))) continue
  const text = page(r.path)
  check("JP1", /<div id="root">\s*\S/.test(text), `${r.path} has an empty #root, so it needs JavaScript to read`)
  check("JP1", text.includes(`<link rel="canonical" href="${SITE.origin}${r.path}" />`), `${r.path} is not canonical on ${SITE.origin}`)
  check("JP1", text.includes(`<title>${html(r.title)}</title>`), `${r.path} lacks its own title`)
}
const home = page("/")
check("JP1", home.includes(html(SITE.description)), "the home page HTML lacks the site's description")
check("JP1", home.includes('<link rel="icon" type="image/svg+xml" href="/logo.svg" />'), "the home page does not use the mark as favicon")
check("JP1", existsSync(join(DIST, "404.html")), "404.html is missing, so GitHub Pages serves its own")
for (const keep of ["logo.svg", "site.webmanifest", "icon-192.png", "icon-512.png", "apple-touch-icon.png"]) {
  check("JP1", existsSync(join(DIST, keep)), `${keep} is not served`)
}
const manifest = JSON.parse(read("site.webmanifest"))
for (const icon of manifest.icons) check("JP1", existsSync(join(DIST, icon.src.replace(/^\//, ""))), `the manifest names ${icon.src}, which is not built`)
check("JP1", !existsSync(join(DIST, "docs")) && !existsSync(join(DIST, "scripts")), "docs/ or scripts/ is published")

// JP1 — no colour or radius in src/ is declared outside the design system, except
// src/tone.css: the green tone the design system does not ship.
const sources = walk(join(REPO, "src")).filter((f) => /\.(css|tsx)$/.test(f) && f !== join(REPO, "src", "tone.css"))
for (const f of sources) {
  const text = readFileSync(f, "utf8")
  const colour = text.match(/#[0-9a-fA-F]{3,8}\b|\b(?:rgb|rgba|hsl|hsla|oklch)\(/)
  check("JP1", !colour, `${relative(REPO, f)} declares a colour of its own (${colour?.[0]})`)
  const radius = text.match(/border-radius:(?!\s*(?:var\(--vg-radius|inherit|50%))[^;]+|rounded-\[(?!var\(--vg-radius)[^\]]+\]/)
  check("JP1", !radius, `${relative(REPO, f)} declares a radius of its own (${radius?.[0]})`)
}

if (failures.length) {
  console.error(`verify: ${failures.length} failure(s)\n  ${failures.join("\n  ")}`)
  process.exit(1)
}
console.log(`verify: ${pages.length} pages pass every check`)
