import { SiteButton, SiteHero } from "@viglet/viglet-design-system/site"
import { SITE, absolute } from "../data/site.ts"
import { STATUS_LABEL, productPath, siteLabel, type Product as P } from "../data/products.ts"

/** schema.org for the product (JP4): what lets a search engine or an assistant cite it by name. */
export function productJsonLd(p: P) {
  const site = /^https?:/.test(p.site) ? p.site : absolute(p.site)
  const author = { "@type": "Person", name: SITE.author }
  const brand = { "@type": "Brand", name: SITE.name, url: absolute("/") }
  if (p.schema.type === "WebSite") {
    return { "@context": "https://schema.org", "@type": "WebSite", name: p.name, description: p.blurb, url: site, author, publisher: brand }
  }
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: p.name,
    description: p.blurb,
    url: absolute(productPath(p)),
    applicationCategory: p.schema.category,
    operatingSystem: p.schema.os,
    sameAs: [site],
    author,
    brand,
  }
}

/* The page summarizes the product and links to its own site; it does not copy that
   site's content, which stays the product's to keep current. */
export function Product({ product: p }: { product: P }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(p)).replace(/</g, "\\u003c") }} />
      <div className="vg-site-wrap pt-6!">
        <nav aria-label="Breadcrumb" className="flex flex-wrap gap-2 text-sm text-muted-foreground">
          <a className="hover:text-foreground" href="/">
            Home
          </a>
          <span aria-hidden="true">/</span>
          <a className="hover:text-foreground" href="/#products">
            Products
          </a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{p.name}</span>
        </nav>
      </div>
      <SiteHero
        icon={{ src: p.logo, alt: p.name }}
        badge={p.kind}
        title={p.name}
        sub={p.blurb}
        meta={[<span key="status" data-status={p.status}>{STATUS_LABEL[p.status]}</span>, siteLabel(p)]}
        actions={
          p.status === "offline" ? undefined : (
            <SiteButton href={p.site}>Go to {siteLabel(p)}</SiteButton>
          )
        }
      />
    </>
  )
}
