// Writes every page of the site, and the icons the manifest names (JP1).
//
// Runs after `vite build` (dist/, holding the index.html template and the client assets)
// and `vite build --ssr src/entry-server.tsx` (dist-server/). For each route in the
// table, the prerendered page (prerenderSite, from the design system). Then the PNG
// icons, drawn from public/logo.svg, which is the one source of the mark here: a copy
// of marca/logo/japode.svg in the visibility repository.

import { copyFileSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { Resvg } from "@resvg/resvg-js"
import { prerenderSite } from "@viglet/viglet-design-system/vite"
import { siteThemeScript } from "@viglet/viglet-design-system/site"
import * as app from "../dist-server/entry-server.js"

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const DIST = join(REPO, "dist")
const { SITE } = app

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
  sitemap: false,
  robots: false,
  log: (line) => console.log(line),
})

// GitHub Pages serves /404.html for any path it does not have.
copyFileSync(join(DIST, "404", "index.html"), join(DIST, "404.html"))

// The PNG icons a manifest and an iOS home screen ask for, from the one SVG.
const logo = readFileSync(join(REPO, "public", "logo.svg"), "utf8")
for (const [file, size] of [["icon-192.png", 192], ["icon-512.png", 512], ["apple-touch-icon.png", 180]]) {
  writeFileSync(join(DIST, file), new Resvg(logo, { fitTo: { mode: "width", value: size } }).render().asPng())
}

console.log(`prerendered ${written.length} pages`)
