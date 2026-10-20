# Improvements

## Block A — A storefront search engines can read

### §JP6 GA4 behind consent, and Search Console

GA4 loads only after consent, with a banner the footer reopens (AG1 in alegauss).
Alexandre creates the GA4 property and the Search Console property
(`sc-domain:japode.com`) and grants read access to the visibility service account; the
visibility collection then picks the site up. The property ID lives in
`src/data/site.ts`.

## Block B — Tied to the rest of the house

## Block C — Everything under japode.com

### §JP14 The engine in the storefront

The strategy puts Editais (08) first among the verticals, with Tools (19) beside it.
Once the first one is live, the storefront gains a section for it, stating the question
it answers and the coverage it declares. Until then no vertical appears here, per the
non-goal "Pages for verticals that do not exist yet".

### §JP15 HTTPS on japode.com

On 2026-10-20 the Pages custom domain is japode.com, but GitHub's certificate for it
sits in `bad_authz` ("The ACME authorization is in a bad state"), and the API refuses
`https_enforced` until a certificate exists. Removing and re-adding the domain did not
move it. So http://japode.com still answers 200 instead of redirecting, and
`https://www.japode.com/` redirects to `http://japode.com/`.

The likely cause is `www`: it resolves to Cloudflare's proxy (104.21.x, 172.67.x) while
the apex points straight at GitHub. Setting `www` in Cloudflare to a DNS-only CNAME to
`japode.github.io` (grey cloud) lets GitHub validate and serve both names. Once `gh api
repos/Japode/japode.github.io/pages` shows the certificate `approved`, enforce HTTPS on
this repository (`https_enforced=true`) and check that photo-boost keeps its own
enforcement. Done when http://japode.com and http://www.japode.com both 301 to
https://japode.com/.
