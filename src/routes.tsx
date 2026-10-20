import type { ReactNode } from "react"
import { SITE } from "./data/site.ts"
import { PRODUCTS, productPath } from "./data/products.ts"
import { Home } from "./pages/Home.tsx"
import { Product } from "./pages/Product.tsx"
import { NotFound } from "./pages/NotFound.tsx"

/* The route table: every page the site serves, built from the catalogue, so adding a
   product adds its page, its sitemap row, its llms.txt line and its OG card with no
   other edit (JP5). prerender.mjs writes one page per row. */

/** An SVG text does not wrap, so a card's supporting line is broken into rows that fit. */
const rows = (text: string, width = 58): string[] =>
  text.split(" ").reduce<string[]>((out, word) => {
    const last = out.at(-1)
    if (last !== undefined && `${last} ${word}`.length <= width) out[out.length - 1] = `${last} ${word}`
    else out.push(word)
    return out
  }, [])

export interface OgCard {
  eyebrow: string
  title: string[]
  titleAccent?: string
  line?: string | string[]
  /** The mark drawn on the card, under public/; the site's own when absent. */
  mark?: string
}

export interface Route {
  path: string
  title: string
  description: string
  card: OgCard
  /** Listed in the sitemap and llms.txt. The 404 page is a route and not a page to index. */
  index: boolean
  /** The section llms.txt files it under. */
  section: "Site" | "Products"
  render: () => ReactNode
}

export const ROUTES: Route[] = [
  {
    path: "/",
    title: SITE.title,
    description: SITE.description,
    card: { eyebrow: "Japode", title: ["Small software"], titleAccent: "that does one job.", line: PRODUCTS.map((p) => p.name).join(" · ") },
    index: true,
    section: "Site",
    render: () => <Home />,
  },
  ...PRODUCTS.map<Route>((p) => ({
    path: productPath(p),
    title: `${p.name}: ${p.kind} — Japode`,
    description: p.blurb,
    card: { eyebrow: p.kind, title: [p.name], line: rows(p.blurb), mark: p.logo },
    index: true,
    section: "Products",
    render: () => <Product product={p} />,
  })),
  {
    path: "/404/",
    title: "Not found — Japode",
    description: "Nothing lives at this address.",
    card: { eyebrow: "Japode", title: ["Nothing lives"], titleAccent: "at this address." },
    index: false,
    section: "Site",
    render: () => <NotFound />,
  },
]

export const routeFor = (path: string): Route => {
  const clean = path.endsWith("/") ? path : `${path}/`
  return ROUTES.find((r) => r.path === clean) ?? ROUTES.find((r) => r.path === "/404/")!
}
