# Improvements

## Block A — A storefront search engines can read

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
