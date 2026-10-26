/* The catalogue: every Japode product, one entry each. The home page reads it at build,
   so a product added here is listed with no other edit. Each mark is a copy of the one
   the product's own repository ships, kept under public/products/.

   `status` is stated as it is: a product in development or offline gets no download
   button, and an offline one gets no link either, since its address answers nothing. */

export type Status = "live" | "in-development" | "offline"

export interface Product {
  id: string
  name: string
  /** What kind of thing it is, in two or three words. */
  kind: string
  /** One sentence on what the product does. */
  blurb: string
  /** Where it lives: an absolute URL, or a path on this origin for a project site. */
  site: string
  /** The product's mark, under public/. */
  logo: string
  status: Status
  /**
   * What the product page's JSON-LD calls it (JP4): an app someone installs is a
   * SoftwareApplication, with the system it runs on; a web service is a WebSite.
   */
  schema: { type: "SoftwareApplication"; os: string; category: string } | { type: "WebSite" }
}

export const STATUS_LABEL: Record<Status, string> = {
  live: "Live",
  "in-development": "In development",
  offline: "Offline",
}

export const PRODUCTS: Product[] = [
  {
    id: "skillgist",
    name: "skillgist",
    kind: "Web service",
    blurb: "Shares Claude Code skills by URL: upload a skill, get a link, and whoever opens it installs the skill with one command.",
    site: "https://skillgist.com/",
    logo: "/products/skillgist.svg",
    status: "live",
    schema: { type: "WebSite" },
  },
  {
    id: "trabalharei",
    name: "trabalharei",
    kind: "Web service",
    blurb: "An independent job search for Brazil: openings gathered from partner sites, deduplicated, each one linking out to its source.",
    site: "https://trabalharei.com.br/",
    logo: "/products/trabalharei.svg",
    status: "offline",
    schema: { type: "WebSite" },
  },
  {
    id: "japode-ads",
    name: "Japode Ads",
    kind: "Ad network",
    blurb: "The house banner network: the Japode and Viglet products advertise each other, served as static files with no ad server and no bidding.",
    site: "https://ads.japode.com/",
    logo: "/products/japode-ads.svg",
    status: "live",
    schema: { type: "WebSite" },
  },
]

/** The address as a reader would type it: host and path, without the scheme. */
export const siteLabel = (p: Product) => p.site.replace(/^https?:\/\//, "").replace(/\/$/, "")

/** The product's page on this site (JP4). */
export const productPath = (p: Product) => `/products/${p.id}/`
