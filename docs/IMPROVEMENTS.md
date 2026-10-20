# Improvements

## Block A — A storefront search engines can read

### §JP1 A storefront on the alegauss pattern

Reuse the base of alegauss.github.io (AG2 and AG3): Vite 8, React 19, Tailwind 4 and
`@viglet/viglet-design-system`, with the HTML prerendered at build by `vite build --ssr`
and `scripts/prerender.mjs`. Only `dist/` is deployed. The canonical origin is
`https://japode.com` from day one, so canonical links, the sitemap and OG cards are born
on the final address. All copy is in English. The logo is the green V shaped like an
arrow, copied from `marca/logo/japode.svg` in the visibility repository, which is its
source; the favicon and the manifest come from it. Done when `npm run build` writes the
home page as static HTML that reads without JavaScript.

### §JP2 Deploying through GitHub Actions

The same `deploy.yml` as alegauss: it runs on push to main and by hand, runs `npm run
build` and publishes `dist/` with `upload-pages-artifact` and `deploy-pages`.
`public/CNAME` carries `japode.com` (the domain itself is block C). This is the
organization site (`Japode/japode.github.io`), so project sites such as PhotoBoost's
stay at `/<repo>/` and the build must write nothing at those paths: `verify.mjs` refuses
any file under `dist/photo-boost/`. Turning on Pages from Actions in the repository
settings is Alexandre's step.

### §JP3 The catalogue in code

`src/data/products.ts` is the list, like alegauss's `projects.ts`: id, name, one
sentence on what the product does, address, logo and status. It holds PhotoBoost (AI
photo enhancement on Windows, local and account-free, in development), skillgist (share
Claude Code skills by URL, skillgist.com), trabalharei (job search in Brazil,
trabalharei.com.br) and Japode Ads (the house banner network, ads.japode.com). Status is
stated as it is: a product in development or offline gets no download button. The home
page reads this list at build.

### §JP4 A page per product

`/products/<id>/` for every catalogue entry, with `SoftwareApplication` JSON-LD (or
`WebSite` for the web services), like AG5 in alegauss. The page summarizes the product
and links to its own site; it does not copy that site's content. PhotoBoost points to
`/photo-boost/`, where its site lives.

### §JP5 The files for machines

Like AG6 in alegauss: the design system's `prerenderSite` writes, for each route, the
HTML, a Markdown twin and an OG card, then `sitemap.xml`, `robots.txt` and `llms.txt`.
The sitemap lists only this repository's routes; PhotoBoost publishes its own.

### §JP6 GA4 behind consent, and Search Console

GA4 loads only after consent, with a banner the footer reopens (AG1 in alegauss).
Alexandre creates the GA4 property and the Search Console property
(`sc-domain:japode.com`) and grants read access to the visibility service account; the
visibility collection then picks the site up. The property ID lives in
`src/data/site.ts`.

## Block B — Tied to the rest of the house

### §JP7 Both ways with PhotoBoost

Here, PhotoBoost has its card and its page. There, the header or footer of PhotoBoost's
site gets the Japode mark linking to the root. The change on PhotoBoost's side is a task
in its own roadmap (prefix PB), filed there only; Alexandre decides when it lands.

### §JP8 The banner slot

A slot with the ads.japode.com loader, as on the other sites. The loader adds
`utm_source=japode-ads` to the destination, so the advertised product's GA records the
source. The banner sits outside the main content and waits for consent if the loader
sets a cookie.

### §JP9 The catalogue as JSON

The build writes `dist/products.json` from `src/data/products.ts`, like alegauss's
`projects.json`. Nobody edits the JSON by hand: it is build output.

### §JP10 The sponsor block

A `sponsor.json` and the design system's `SiteSponsor` component, like AG7 in alegauss:
"built with Viglet Turing and Shio", with the names as decided (Viglet Turing on first
mention). trabalharei runs on Turing and Dumont; the verticals' engine will run on
Turing and Shio.

## Block C — Everything under japode.com

### §JP11 The japode.com domain

Decided on 2026-10-20: the site lives at japode.com. With the `CNAME` on the
organization site, GitHub serves project sites under the same domain, so PhotoBoost
moves to japode.com/photo-boost/. Alexandre sets the DNS (the Pages A and AAAA records
on the apex, `www` as a CNAME) and turns on HTTPS. Done when https://japode.com opens
the site and japode.github.io redirects there. ads.japode.com keeps its own CNAME and
does not change.

### §JP12 PhotoBoost on the new domain

`SITE_ORIGIN` in PhotoBoost's `site/vite.config.ts` and `site/src/routes.ts` becomes
`https://japode.com`; `BASE` stays `/photo-boost/`. It is a change in PhotoBoost's
repository, filed there under the PB prefix.

### §JP13 The paths reserved for the engine

`SUMMARY.md` in the strategy repository plans permalinks at `https://japode.com/v/<id>`.
`verify.mjs` refuses any file built under `dist/v/`, and robots.txt does not block the
path. When the engine exists, the domain split is decided then: a proxy, a subdomain or
another deploy. This keeps to the non-goal "Pages for verticals that do not exist yet".

### §JP14 The engine in the storefront

The strategy puts Editais (08) first among the verticals, with Tools (19) beside it.
Once the first one is live, the storefront gains a section for it, stating the question
it answers and the coverage it declares. Until then no vertical appears here, per the
non-goal "Pages for verticals that do not exist yet".
