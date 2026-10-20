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

// JP4 — every product has a page, linked from the home page, carrying JSON-LD of the
// kind its catalogue entry declares, and linking out to the product's own site.
for (const p of PRODUCTS) {
  const path = app.productPath(p)
  const file = join(app.outputDir(path), "index.html")
  check("JP4", existsSync(join(DIST, file)), `${path} is missing`)
  if (!existsSync(join(DIST, file))) continue
  const text = page(path)
  check("JP4", home.includes(`href="${path}"`), `the home page does not link ${path}`)
  const ld = [...text.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]))
  check("JP4", ld.some((x) => x["@type"] === p.schema.type && x.name === p.name), `${path} has no ${p.schema.type} JSON-LD naming ${p.name}`)
  const links = text.includes(`href="${html(p.site)}"`)
  check("JP4", p.status === "offline" ? !links : links, p.status === "offline" ? `${path} links an offline address` : `${path} does not link ${p.site}`)
}

// JP5 — every route has an OG card it points at and a Markdown twin; every indexed one
// is in the sitemap and llms.txt, and the 404 is in neither. robots.txt names this
// sitemap and each project site's, since crawlers read robots.txt at the root only.
const sitemap = read("sitemap.xml")
const llms = read("llms.txt")
const robots = read("robots.txt")
for (const r of ROUTES) {
  const slug = app.outputDir(r.path).replaceAll("/", "-") || "home"
  check("JP5", existsSync(join(DIST, "og", `${slug}.png`)), `no OG card for ${r.path}`)
  check("JP5", page(r.path).includes(`og:image" content="${SITE.origin}/og/${slug}.png"`), `${r.path} does not point at its OG card`)
  check("JP5", existsSync(join(DIST, app.outputDir(r.path), "index.md")), `${r.path} has no Markdown twin`)
  check("JP5", sitemap.includes(`<loc>${SITE.origin}${r.path}</loc>`) === r.index, r.index ? `the sitemap lacks ${r.path}` : `the sitemap lists ${r.path}`)
  check("JP5", llms.includes(`${SITE.origin}${r.path}index.md`) === r.index, r.index ? `llms.txt lacks ${r.path}` : `llms.txt lists ${r.path}`)
}
check("JP5", robots.includes(`Sitemap: ${SITE.origin}/sitemap.xml`), "robots.txt does not name the sitemap")
for (const s of app.localSites()) {
  check("JP5", robots.includes(`Sitemap: ${SITE.origin}${s}sitemap.xml`), `robots.txt does not name ${s}sitemap.xml`)
  check("JP5", !sitemap.includes(`<loc>${SITE.origin}${s}`), `the sitemap lists ${s}, which publishes its own`)
}
for (const p of PRODUCTS) check("JP5", llms.includes(p.blurb), `llms.txt lacks ${p.name}`)

// JP6 — no request to googletagmanager.com leaves a page before consent: the tag is in
// no built HTML, and the footer offers the settings only when there is a tag to consent to.
for (const f of pages) check("JP6", !readFileSync(f, "utf8").includes("googletagmanager"), `${relative(DIST, f)} loads the tag before consent`)
check("JP6", home.includes("Analytics settings") === Boolean(SITE.analytics), SITE.analytics ? "the footer cannot reopen the consent banner" : "the footer offers analytics settings with no analytics")

// JP9 — products.json carries every catalogue entry, in the catalogue's order and words,
// with absolute addresses another origin can follow.
const published = JSON.parse(read("products.json"))
check("JP9", published.map((x) => x.id).join() === PRODUCTS.map((p) => p.id).join(), "products.json disagrees with the catalogue on which products exist")
for (const p of PRODUCTS) {
  const x = published.find((y) => y.id === p.id)
  if (!x) continue
  check("JP9", x.name === p.name && x.blurb === p.blurb && x.status === p.status, `products.json disagrees with the catalogue on ${p.name}`)
  check("JP9", [x.site, x.logo, x.page].every((u) => /^https:\/\//.test(u)), `products.json gives ${p.name} a relative address`)
}

// JP8 — every page carries one Japode Ads slot outside <main>, the loader that fills it,
// and a slot that stores nothing, so the banner needs no consent.
for (const r of ROUTES) {
  const text = page(r.path)
  const slots = text.match(/<div data-japode-ads=""[^>]*>/g) ?? []
  check("JP8", slots.length === 1, `${r.path} has ${slots.length} Japode Ads slots`)
  check("JP8", slots.every((s) => s.includes('data-ad-memory="off"')), `${r.path}'s slot stores its rotation in the visitor's browser`)
  check("JP8", text.indexOf("data-japode-ads") > text.indexOf("</main>"), `${r.path}'s slot sits inside the main content`)
  check("JP8", text.includes('<script src="https://ads.japode.com/v1/ads.js" async></script>'), `${r.path} does not load the Japode Ads loader`)
}

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
