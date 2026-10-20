/* The Markdown twin of every page (index.md beside index.html) and llms.txt (JP5).
   Written from the same data as the pages rather than scraped from their HTML, so an
   agent reading the twin gets every fact the page states and none of its chrome. */

import { SITE, absolute } from "./data/site.ts"
import { PRODUCTS, STATUS_LABEL, productPath, type Product } from "./data/products.ts"
import { ROUTES, routeFor } from "./routes.tsx"

const url = (href: string) => (/^https?:/.test(href) ? href : absolute(href))
const link = (text: string, href: string) => `[${text}](${url(href)})`
const item = (p: Product) => `- ${link(p.name, productPath(p))}: ${p.kind}, ${STATUS_LABEL[p.status].toLowerCase()}. ${p.blurb}`

function product(p: Product): string {
  return [
    `# ${p.name}`,
    "",
    `${p.kind} · ${STATUS_LABEL[p.status]}`,
    "",
    p.blurb,
    "",
    p.status === "offline" ? `- Address: ${url(p.site)} (not answering right now)` : `- Product site: ${url(p.site)}`,
  ].join("\n")
}

function body(path: string): string {
  const route = routeFor(path)
  if (path === "/") return [`# ${SITE.title}`, "", SITE.description, "", "## Products", "", ...PRODUCTS.map(item)].join("\n")
  const p = PRODUCTS.find((x) => productPath(x) === path)
  if (p) return product(p)
  return `# ${route.title}\n\n${route.description}`
}

export const twin = (path: string) => `${body(path)}\n`

/** The product sites that live on this origin, which the sitemap and robots.txt name. */
export const localSites = () => PRODUCTS.filter((p) => p.site.startsWith("/")).map((p) => p.site)

/** llms.txt: the site's index for a language model, in the llmstxt.org shape. */
export function llmsTxt(): string {
  const sections = ["Site", "Products"] as const
  return (
    [
      `# ${SITE.name}`,
      "",
      `> ${SITE.description}`,
      "",
      "Every page has a Markdown twin: append index.md to its URL.",
      ...sections.flatMap((s) => [
        "",
        `## ${s}`,
        "",
        ...ROUTES.filter((r) => r.index && r.section === s).map((r) => `- [${r.title}](${absolute(`${r.path}index.md`)}): ${r.description}`),
      ]),
      "",
      "## Product sites",
      "",
      ...PRODUCTS.filter((p) => p.status !== "offline").map((p) => `- [${p.name}](${url(p.site)}): ${p.blurb}`),
    ].join("\n") + "\n"
  )
}
