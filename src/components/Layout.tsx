import type { ReactNode } from "react"
import { SiteButton, SiteFooter, SiteNav, SiteSponsor, type SponsorDeclaration } from "@viglet/viglet-design-system/site"
import sponsor from "../../sponsor.json"
import { SITE } from "../data/site.ts"
import { Island } from "../islands.tsx"

const FOOT = [{ href: SITE.github, label: "GitHub" }]

export function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <a className="jp-skip" href="#main">
        Skip to content
      </a>
      <SiteNav
        brand={{ href: "/", name: SITE.name, logo: "/logo.svg" }}
        actions={
          <>
            <Island name="theme-toggle" />
            <SiteButton href={SITE.github}>GitHub</SiteButton>
          </>
        }
      />
      <main id="main">{children}</main>
      <SiteFooter
        brand={{ href: "/", name: SITE.name, logo: "/logo.svg" }}
        links={FOOT}
        before={
          // the Japode Ads slot (JP8): after the content and outside the chrome. The loader
          // sets no cookie, and memory "off" keeps it from storing its rotation either, so
          // there is nothing to consent to. index.html loads the script.
          <aside className="vg-site-wrap pb-10!"aria-label="From the Japode family">
            <div data-japode-ads="" data-ad-format="footer" data-ad-slot="storefront-footer" data-ad-memory="off" />
          </aside>
        }
        sponsor={
          <SiteSponsor
            declaration={sponsor as SponsorDeclaration}
            assetBase="/"
            moreLabel="More at"
            note="trabalharei's search runs on Viglet Turing, fed by Viglet Dumont."
          />
        }
        disclaimer={
          <>
            © 2026 {SITE.author}. {SITE.analytics ? <Island name="consent-settings" /> : null}
          </>
        }
      />
    </>
  )
}
