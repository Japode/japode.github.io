# Roadmap (active backlog)

## Block A — A storefront search engines can read

## Block B — Tied to the rest of the house

- ⏳ **JP7** (deps: JP3 ✅, PB49 in photo-boost) **PhotoBoost's site and the brand's site do not link to each other** — PhotoBoost's site links back to the storefront once PB49 lands in its repository. → §JP7

## Block C — Everything under japode.com

- 📋 **JP11** (deps: JP2 ✅) **japode.com does not point at the organization's GitHub Pages site** — The domain was decided on 2026-10-20, and until DNS changes the site lives only at japode.github.io. → §JP11
- 📋 **JP12** (deps: JP11) **PhotoBoost's site still declares japode.github.io as its origin** — Canonical links and a sitemap on the old address split indexing across two domains. → §JP12
- 📋 **JP13** (deps: JP2 ✅) **nothing stops the site from taking the paths the verticals' engine will use** — The strategy reserves japode.com/v/<id> for dated answers; a route there now would break those links later. → §JP13
- 💭 **JP14** (deps: JP3 ✅, 08 Editais live) **once the first vertical (Editais) ships, the site has nowhere to present it** — The storefront should show the engine when a real vertical exists, and never before. → §JP14

## Done when — JP6

- **GA4 and Search Console report japode.com to the visibility collection**
  SITE.analytics holds the GA4 id, verify.mjs passes with it set, and the visibility
  service account reads both the GA4 property and sc-domain:japode.com.

## Done when — JP7

- **PhotoBoost's site links back to the Japode storefront** The built /photo-boost/
  pages carry a link to the origin root with the Japode name, from PB49 in PhotoBoost's
  repository.

## Non-goals

- **Content written to pull search traffic** The strategy rules out the content, traffic
  and ads model; the site presents products and publishes no articles to rank.
- **Hosting the products' own sites here** Each product keeps its site in its own
  repository; the storefront summarizes and links to it.
- **Sign-up, forms or login on the storefront** The only data collected is GA behind
  consent; the watcher's sign-up belongs to the verticals.
- **Pages for verticals that do not exist yet** An idea in the strategy repository
  becomes a page only once the vertical is live.
