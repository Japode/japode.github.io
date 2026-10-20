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
const { SITE, ROUTES, PRODUCTS, STATUS_LABEL } = app
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

// JP2 — the deploy publishes only the build output, the domain file rides with it, and
// nothing is built at the paths the organization's project sites own: GitHub serves
// PhotoBoost at /photo-boost/, and a file here would shadow it.
const workflow = readFileSync(join(REPO, ".github", "workflows", "deploy.yml"), "utf8")
check("JP2", /path:\s*\.?\/?dist\b/.test(workflow), "deploy.yml does not upload dist/")
check("JP2", /npm run build/.test(workflow), "deploy.yml does not run npm run build")
check("JP2", existsSync(join(DIST, ".nojekyll")), ".nojekyll is not served")
check("JP2", existsSync(join(DIST, "CNAME")) && read("CNAME").trim() === new URL(SITE.origin).host, `CNAME does not name ${new URL(SITE.origin).host}`)
for (const project of ["photo-boost"]) check("JP2", !existsSync(join(DIST, project)), `dist/${project}/ would shadow that project's own site`)

// JP3 — the home page HTML lists every product with its sentence, its status and its
// mark; a product offline gets no link to an address that answers nothing, and none
// gets a download button before it ships.
for (const p of PRODUCTS) {
  check("JP3", home.includes(`id="${p.id}"`), `the home page lacks ${p.name}`)
  check("JP3", home.includes(html(p.blurb)), `the home page lacks ${p.name}'s sentence`)
  check("JP3", home.includes(`data-status="${p.status}">${STATUS_LABEL[p.status]}<`), `the home page does not state ${p.name}'s status`)
  check("JP3", existsSync(join(DIST, p.logo.replace(/^\//, ""))), `${p.name}'s mark ${p.logo} is not served`)
  const links = home.includes(`href="${html(p.site)}"`)
  check("JP3", p.status === "offline" ? !links : links, p.status === "offline" ? `${p.name} is offline and still linked` : `the home page does not link ${p.name}`)
}
check("JP3", !/>\s*Download\b/i.test(home), "the home page offers a download")

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
