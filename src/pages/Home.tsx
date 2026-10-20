import { SiteButton, SiteHero, SiteSectionHead } from "@viglet/viglet-design-system/site"
import { SITE } from "../data/site.ts"

export function Home() {
  return (
    <>
      <SiteHero
        icon={{ src: "/logo.svg", alt: "Japode" }}
        badge="Japode"
        title="Small software"
        titleAccent="that does one job."
        sub={SITE.description}
        actions={
          <SiteButton href={SITE.github} variant="ghost">
            Source on GitHub
          </SiteButton>
        }
      />
      <section className="vg-site-wrap pb-20">
        <SiteSectionHead eyebrow="What Japode is" title="One brand, one address">
          Each Japode product keeps its own site. This one is where they meet: what each product does, where it lives and how far along it is, in
          pages a search engine or an assistant can read without running any script.
        </SiteSectionHead>
      </section>
    </>
  )
}
