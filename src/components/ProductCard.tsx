import { STATUS_LABEL, siteLabel, type Product } from "../data/products.ts"

/** One catalogue entry: the mark, what it is, what it does, how far along, and where. */
export function ProductCard({ product: p }: { product: Product }) {
  return (
    <article className="jp-card" id={p.id}>
      <div className="flex items-center gap-3">
        <img className="jp-tile" src={p.logo} alt="" width={44} height={44} />
        <div>
          <h3 className="m-0 text-lg font-bold">{p.name}</h3>
          <p className="jp-meta m-0">
            <span>{p.kind}</span>
            <span data-status={p.status}>{STATUS_LABEL[p.status]}</span>
          </p>
        </div>
      </div>
      <p className="m-0 text-muted-foreground">{p.blurb}</p>
      {p.status === "offline" ? (
        <p className="jp-meta m-0">
          <span>{siteLabel(p)}, not answering right now</span>
        </p>
      ) : (
        <a className="jp-link" href={p.site}>
          {siteLabel(p)} →
        </a>
      )}
    </article>
  )
}
