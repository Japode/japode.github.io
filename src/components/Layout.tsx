import type { ReactNode } from "react"
import { SiteButton, SiteFooter, SiteNav } from "@viglet/viglet-design-system/site"
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
        disclaimer={
          <>
            © 2026 {SITE.author}. {SITE.analytics ? <Island name="consent-settings" /> : null}
          </>
        }
      />
    </>
  )
}
