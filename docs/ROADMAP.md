# Roadmap (active backlog)

## Block A — A storefront search engines can read

- 📋 **JP6** (deps: JP2 ✅) **visits to the site and the searches that lead to it are not measured** — Without numbers, the visibility review cannot tell whether the storefront sends anyone to the products. → §JP6

## Block B — Tied to the rest of the house

- 📋 **JP7** (deps: JP3 ✅) **PhotoBoost's site and the brand's site do not link to each other** — Someone arriving through PhotoBoost should find the other products, and someone arriving through the brand should find PhotoBoost. → §JP7
- 📋 **JP8** (deps: JP2 ✅) **the site does not show the Japode Ads banner the way the other house sites do** — A product storefront is the natural place for the banner that leads from one house product to another. → §JP8
- 📋 **JP9** (deps: JP3 ✅) **Japode's catalogue exists only inside the HTML, so no other site can read it** — A public `products.json` lets alegauss, Japode Ads and the products' footers list the family without copying it. → §JP9
- 📋 **JP10** (deps: JP1 ✅) **the site does not say Japode's products are built on Viglet** — Showing Viglet as the foundation ties the two brands together and sends visitors to Turing, the long-term bet. → §JP10

## Block C — Everything under japode.com

- 📋 **JP11** (deps: JP2 ✅) **japode.com does not point at the organization's GitHub Pages site** — The domain was decided on 2026-10-20, and until DNS changes the site lives only at japode.github.io. → §JP11
- 📋 **JP12** (deps: JP11) **PhotoBoost's site still declares japode.github.io as its origin** — Canonical links and a sitemap on the old address split indexing across two domains. → §JP12
- 📋 **JP13** (deps: JP2 ✅) **nothing stops the site from taking the paths the verticals' engine will use** — The strategy reserves japode.com/v/<id> for dated answers; a route there now would break those links later. → §JP13
- 💭 **JP14** (deps: JP3 ✅, 08 Editais live) **once the first vertical (Editais) ships, the site has nowhere to present it** — The storefront should show the engine when a real vertical exists, and never before. → §JP14

## Non-goals

- **Content written to pull search traffic** The strategy rules out the content, traffic
  and ads model; the site presents products and publishes no articles to rank.
- **Hosting the products' own sites here** Each product keeps its site in its own
  repository; the storefront summarizes and links to it.
- **Sign-up, forms or login on the storefront** The only data collected is GA behind
  consent; the watcher's sign-up belongs to the verticals.
- **Pages for verticals that do not exist yet** An idea in the strategy repository
  becomes a page only once the vertical is live.
