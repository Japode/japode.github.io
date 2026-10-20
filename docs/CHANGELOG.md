# Shipped Ledger

## Block A — A storefront search engines can read

- ✅ **JP1** **japode.com has no site: someone looking for Japode finds only scattered repositories** — The storefront builds on the alegauss stack: `npm run build` prerenders the home page as static HTML on https://japode.com, with the green mark as favicon and manifest.
- ✅ **JP2** **nothing deploys the site: the repository has no GitHub Pages workflow** — A push to main builds, verifies and publishes `dist/` through GitHub Actions, with `CNAME` japode.com, and verify.mjs refuses a build that writes under `dist/photo-boost/`.
- ✅ **JP3** **Japode's products are listed nowhere together, with what each one does and where it lives** — `src/data/products.ts` lists PhotoBoost, skillgist, trabalharei and Japode Ads with sentence, status, address and mark, and the home page renders it at build.
- ✅ **JP4** **no product has a page of its own with structured data a search engine understands** — Every catalogue entry has `/products/<id>/` with SoftwareApplication or WebSite JSON-LD, a summary and a link to its own site; PhotoBoost's points at `/photo-boost/`.
- ✅ **JP5** **the site writes no sitemap, robots.txt, llms.txt or per-page OG card** — Each route gets a Markdown twin and a green OG card; sitemap.xml and llms.txt list the indexed pages, and robots.txt names this sitemap and PhotoBoost's.
- ✅ **JP6 (consent half)** **visits to the site and the searches that lead to it are not measured** — The consent banner, the footer's settings link and the gated GA4 loader are built and verified; with no measurement id set, nothing is shown or loaded.

## Block B — Tied to the rest of the house

- ✅ **JP7** **PhotoBoost's site and the brand's site do not link to each other** — Both ways now: the storefront links PhotoBoost, and PhotoBoost's nav chip and footer link back to the Japode storefront at the origin root (PB49).
- ✅ **JP8** **the site does not show the Japode Ads banner the way the other house sites do** — Every page carries a footer-format Japode Ads slot after the content, filled by the ads.japode.com loader; the slot stores nothing, so it needs no consent.
- ✅ **JP9** **Japode's catalogue exists only inside the HTML, so no other site can read it** — The build writes `products.json` from `src/data/products.ts`, with each product's name, sentence, status and absolute site, mark and page addresses.
- ✅ **JP10** **the site does not say Japode's products are built on Viglet** — Every page's footer carries the design system's SiteSponsor from `sponsor.json`: built on Viglet, naming Viglet Turing and Shio, with trabalharei on Turing and Dumont.

## Block C — Everything under japode.com

- ✅ **JP13** **nothing stops the site from taking the paths the verticals' engine will use** — verify.mjs fails the build if anything lands under `dist/v/` or a route under `/v/`, and if robots.txt blocks the path the verticals' engine will use.
- ✅ **JP11** **japode.com does not point at the organization's GitHub Pages site** — japode.com points at the organization's Pages site, registered as its custom domain; https://japode.com and japode.com/photo-boost/ answer, and www redirects to the apex.
- ✅ **JP12** **PhotoBoost's site still declares japode.github.io as its origin** — PhotoBoost's site declares https://japode.com as its origin (PB50): its canonical links, hreflang and sitemap name japode.com/photo-boost/.
