# domi-blog

Portfolio site. Next.js (App Router) + SCSS Modules. No Tailwind.

## Scripts

```bash
npm run dev        # http://localhost:1133
npm run build
npm run lint
npm run typecheck
```

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL` (used by canonical, OG, sitemap, robots).

## Structure

```
src/
  app/                 routes + SEO files (robots, sitemap, manifest, icons, opengraph-image)
  components/
    intro/             logo-drawing intro overlay
    fluid/             interactive pearl-fluid background (WebGL2)
    JsonLd.tsx         schema.org structured data
  lib/
    site.ts            site identity (single source for SEO)
    seo.ts             pageMetadata() helper
    og.tsx             shared OG image renderer
  styles/
    abstracts/         tokens, functions, mixins (no CSS output)
    base/              reset, CSS variables, typography, a11y
    globals.scss
```

In a `*.module.scss`: `@use "abstracts" as *;`
