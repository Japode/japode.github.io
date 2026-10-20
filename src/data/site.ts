/* Site-wide settings. Each one is a single edit: the origin every canonical link is
   written under, and the names the chrome repeats on every page. */

export const SITE = {
  name: "Japode",
  /** The origin every canonical URL is written under: the final address from day one. */
  origin: "https://japode.com",
  title: "Japode — small software that does one job",
  description:
    "Japode is a family of small products by Alexandre Oliveira: a photo app that runs on your own Windows PC, web services for developers and job seekers, and the house ad network that links them.",
  github: "https://github.com/Japode",
  author: "Alexandre Oliveira",
  /** The theme choice is stored under this key, as every product site names its own. */
  themeKey: "japode-theme",
} as const

export const absolute = (path: string) => `${SITE.origin}${path}`
