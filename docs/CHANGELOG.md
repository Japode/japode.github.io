# Shipped Ledger

## Block A — A storefront search engines can read

- ✅ **JP1** **japode.com has no site: someone looking for Japode finds only scattered repositories** — The storefront builds on the alegauss stack: `npm run build` prerenders the home page as static HTML on https://japode.com, with the green mark as favicon and manifest.
- ✅ **JP2** **nothing deploys the site: the repository has no GitHub Pages workflow** — A push to main builds, verifies and publishes `dist/` through GitHub Actions, with `CNAME` japode.com, and verify.mjs refuses a build that writes under `dist/photo-boost/`.
- ✅ **JP3** **Japode's products are listed nowhere together, with what each one does and where it lives** — `src/data/products.ts` lists PhotoBoost, skillgist, trabalharei and Japode Ads with sentence, status, address and mark, and the home page renders it at build.
- ✅ **JP4** **no product has a page of its own with structured data a search engine understands** — Every catalogue entry has `/products/<id>/` with SoftwareApplication or WebSite JSON-LD, a summary and a link to its own site; PhotoBoost's points at `/photo-boost/`.
- ✅ **JP5** **the site writes no sitemap, robots.txt, llms.txt or per-page OG card** — Each route gets a Markdown twin and a green OG card; sitemap.xml and llms.txt list the indexed pages, and robots.txt names this sitemap and PhotoBoost's.
- ✅ **JP6 (consent half)** **visits to the site and the searches that lead to it are not measured** — The consent banner, the footer's settings link and the gated GA4 loader are built and verified; with no measurement id set, nothing is shown or loaded.

## Block B — Tied to the rest of the house

## Block C — Everything under japode.com
