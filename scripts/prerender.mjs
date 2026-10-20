// Writes every page of the site, and every file built from the same data (JP1, JP5).
//
// Runs after `vite build` (dist/, holding the index.html template and the client assets)
// and `vite build --ssr src/entry-server.tsx` (dist-server/). For each route in the
// table: the prerendered page and its Markdown twin (prerenderSite, from the design
// system), an og:image card drawn from the route's own words, and the route's rows in
// sitemap.xml and llms.txt. Then robots.txt and the PNG icons, drawn from
// public/logo.svg, which is the one source of the mark here: a copy of
// marca/logo/japode.svg in the visibility repository.

import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { Resvg } from "@resvg/resvg-js"
import { lastAuthoredChange, ogCardSvg, prerenderSite, renderOgCard } from "@viglet/viglet-design-system/vite"
import { siteThemeScript } from "@viglet/viglet-design-system/site"
import * as app from "../dist-server/entry-server.js"

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const DIST = join(REPO, "dist")
const { SITE, ROUTES } = app

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
const abs = (path) => `${SITE.origin}${path}`
const slug = (path) => app.outputDir(path).replaceAll("/", "-") || "home"

// The theme's pre-paint script goes into the template once, so every page inherits it.
const templatePath = join(DIST, "index.html")
const template = readFileSync(templatePath, "utf8")
if (!template.includes("<!--theme-script-->")) throw new Error("prerender: index.html lost its <!--theme-script--> anchor")
writeFileSync(templatePath, template.replace("<!--theme-script-->", `<script>${siteThemeScript(SITE.themeKey)}</script>`))

const written = prerenderSite({
  distDir: DIST,
  routes: app.ROUTE_META,
  render: app.render,
  canonicalUrl: app.canonicalUrl,
  outputDir: app.outputDir,
  twin: app.twin,
  manifest: { name: SITE.name, base: "/", llms: "llms.txt" },
  // the helper's versions list every route, the 404 among them, and cannot name the
  // project sites on this origin; both are written below instead
  sitemap: false,
  robots: false,
  log: (line) => console.log(line),
})

// One card per page, drawn from that page's words: a product's card carries its mark.
// The design system draws only its own tones, so the card is drawn warm and each warm
// colour swapped for its green one (the dark ground in src/tone.css).
const GREEN = { "#15100c": "#0b140f", "#f4ece4": "#e4f3ea", "#b6a596": "#8fae9a", "#d97757": "#2bcb6b", "#e9a33a": "#a7f3c4" }
const green = (svg) => svg.replace(/#[0-9a-f]{6}\b/gi, (c) => GREEN[c.toLowerCase()] ?? c)
// Only the frame is recoloured: PhotoBoost's mark is drawn in those same warm colours and
// must keep them. So the card is drawn around an empty slot with the mark's viewBox, and
// the mark's own content goes into the slot after the swap.
const SLOT = '<g id="jp-mark-slot"/>'
function card(route) {
  const { eyebrow, title, titleAccent, line } = route.card
  const source = readFileSync(join(REPO, "public", (route.card.mark ?? "/logo.svg").replace(/^\//, "")), "utf8")
  const viewBox = source.match(/viewBox="([^"]+)"/)?.[1]
  const inner = source.match(/<svg[^>]*>([\s\S]*)<\/svg>/)?.[1]
  if (!viewBox || inner === undefined) throw new Error(`prerender: ${route.card.mark} is not an SVG with a viewBox`)
  const frame = green(ogCardSvg({ eyebrow, title, titleAccent, line, mark: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">${SLOT}</svg>`, tone: "warm" }))
  if (!frame.includes(SLOT)) throw new Error("prerender: the OG card no longer embeds the mark's content as given")
  return frame.replace(SLOT, () => inner)
}
mkdirSync(join(DIST, "og"), { recursive: true })
for (const route of ROUTES) {
  const file = `og/${slug(route.path)}.png`
  await renderOgCard({ svg: card(route), out: join(DIST, file) })

  const html = join(DIST, app.outputDir(route.path), "index.html")
  const tags = [
    `<meta property="og:image" content="${esc(abs(`/${file}`))}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:image" content="${esc(abs(`/${file}`))}" />`,
    `<link rel="alternate" type="text/markdown" href="${esc(abs(`${route.path}index.md`))}" />`,
    ...(route.index ? [] : [`<meta name="robots" content="noindex" />`]),
  ]
  writeFileSync(html, readFileSync(html, "utf8").replace("</head>", `  ${tags.join("\n    ")}\n  </head>`))
}

// GitHub Pages serves /404.html for any path it does not have.
copyFileSync(join(DIST, "404", "index.html"), join(DIST, "404.html"))

// sitemap.xml: every indexed page here, then the project sites on this origin, which
// publish their own pages. lastmod is when the authored tree last changed.
const lastmod = lastAuthoredChange(REPO, ["src", "public", "index.html"])
const sites = app.localSites()
writeFileSync(
  join(DIST, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    ROUTES.filter((r) => r.index)
      .map((r) => `  <url>\n    <loc>${esc(abs(r.path))}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ""}\n  </url>`)
      .join("\n") +
    `\n</urlset>\n`,
)

// robots.txt is only read at the host root, so each project site's sitemap has to be
// named here: a Sitemap: line inside /<project>/robots.txt is ignored by crawlers.
writeFileSync(
  join(DIST, "robots.txt"),
  ["User-agent: *", "Allow: /", "", `Sitemap: ${abs("/sitemap.xml")}`, ...sites.map((s) => `Sitemap: ${abs(`${s}sitemap.xml`)}`), ""].join("\n"),
)

writeFileSync(join(DIST, "llms.txt"), app.llmsTxt())

// The PNG icons a manifest and an iOS home screen ask for, from the one SVG.
const logo = readFileSync(join(REPO, "public", "logo.svg"), "utf8")
for (const [file, size] of [["icon-192.png", 192], ["icon-512.png", 512], ["apple-touch-icon.png", 180]]) {
  writeFileSync(join(DIST, file), new Resvg(logo, { fitTo: { mode: "width", value: size } }).render().asPng())
}

console.log(`prerendered ${written.length} pages`)
