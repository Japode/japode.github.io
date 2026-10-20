import type { ReactNode } from "react"
import { SITE } from "./data/site.ts"
import { PRODUCTS, productPath } from "./data/products.ts"
import { Home } from "./pages/Home.tsx"
import { Product } from "./pages/Product.tsx"
import { NotFound } from "./pages/NotFound.tsx"

/* The route table: every page the site serves, built from the catalogue, so adding a
   product adds its page. prerender.mjs writes one page per row. */

export interface Route {
  path: string
  title: string
  description: string
  render: () => ReactNode
}

export const ROUTES: Route[] = [
  {
    path: "/",
    title: SITE.title,
    description: SITE.description,
    render: () => <Home />,
  },
  ...PRODUCTS.map<Route>((p) => ({
    path: productPath(p),
    title: `${p.name}: ${p.kind} — Japode`,
    description: p.blurb,
    render: () => <Product product={p} />,
  })),
  {
    path: "/404/",
    title: "Not found — Japode",
    description: "Nothing lives at this address.",
    render: () => <NotFound />,
  },
]

export const routeFor = (path: string): Route => {
  const clean = path.endsWith("/") ? path : `${path}/`
  return ROUTES.find((r) => r.path === clean) ?? ROUTES.find((r) => r.path === "/404/")!
}
