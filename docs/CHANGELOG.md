# Shipped Ledger

## Block A — A storefront search engines can read

- ✅ **JP1** **japode.com has no site: someone looking for Japode finds only scattered repositories** — The storefront builds on the alegauss stack: `npm run build` prerenders the home page as static HTML on https://japode.com, with the green mark as favicon and manifest.
- ✅ **JP2** **nothing deploys the site: the repository has no GitHub Pages workflow** — A push to main builds, verifies and publishes `dist/` through GitHub Actions, with `CNAME` japode.com, and verify.mjs refuses a build that writes under `dist/photo-boost/`.
- ✅ **JP3** **Japode's products are listed nowhere together, with what each one does and where it lives** — `src/data/products.ts` lists PhotoBoost, skillgist, trabalharei and Japode Ads with sentence, status, address and mark, and the home page renders it at build.
- ✅ **JP4** **no product has a page of its own with structured data a search engine understands** — Every catalogue entry has `/products/<id>/` with SoftwareApplication or WebSite JSON-LD, a summary and a link to its own site; PhotoBoost's points at `/photo-boost/`.

## Block B — Tied to the rest of the house

## Block C — Everything under japode.com
