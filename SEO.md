## Astro SEO audit: Höfn · Dalvík

Follow-up audit run on 2026-07-31 using the `astro-seo` skill and `@jdevalk/astro-seo-graph` 2.2.0. This records the implementation pass against the original 25/90 baseline.

### Score

| Category | Score |
| --- | ---: |
| Head metadata | 9/10 |
| JSON-LD graph | 8/10 |
| Content collections and SEO schema | 8/10 |
| Open Graph and social metadata | 8/10 |
| Sitemap and indexing | 8/10 |
| Agent discovery | 8/10 |
| Performance and rendering | 6/10 |
| Redirects and error handling | 7/10 |
| Validation and content quality | 8/10 |
| **Total** | **70/90** |

### Findings

#### 1. Head metadata

Implemented:

- Added `src/components/BaseHead.astro` as the single head entry point.
- Canonicals are derived from `https://hofn.manifesto.is` and query strings are excluded.
- The `<Seo>` component now emits descriptions, robots directives (`max-snippet`, `max-image-preview`, `max-video-preview`), Open Graph fields, author metadata, and sitemap/LLM links.
- The site remains intentionally monolingual Icelandic, so `hreflang` is not emitted.

Build evidence: `@jdevalk/astro-seo-graph` metadata validation reports all 3 prerendered HTML pages valid and unique.

#### 2. Structured data / JSON-LD graph

Implemented a linked graph in `src/lib/seo.ts` containing:

- `LodgingBusiness` for Höfn, including address, capacity, room count, image, and local topics.
- `WebSite`, `WebPage`/`CollectionPage`, `ImageObject`, and `BreadcrumbList` entities with stable `@id` references.
- Corpus endpoints at `/.well-known/schema-property` and `/.well-known/schema-guide` (both return `application/ld+json`).
- `/schemamap.xml` and `/.well-known/api-catalog` for machine discovery.

Remaining: validate the graph externally in Google Rich Results Test and ClassySchema after the production domain resolves. Business facts such as phone number, price range, and booking provider should only be added once confirmed.

#### 3. Content collections and SEO schema

Implemented:

- The Markdown content collections remain Zod-validated.
- `seo` frontmatter fields now enforce title lengths of 5–120 characters and descriptions of 15–160 characters.
- Full guide content is served as Markdown at `/dalvik-travel-guide.md` with canonical frontmatter and `X-Robots-Tag: noindex, follow`.

Remaining: add per-entry `description`, image, and alt fields to the guidebook frontmatter if individual guide entries ever become standalone indexable pages.

#### 4. Open Graph and social metadata

Implemented:

- Added `public/images/og-hofn.jpg`, a 1200×675 JPEG derived from the property photography.
- Both public pages now emit absolute `og:image`, dimensions, alt text, locale, title, description, and URL tags.
- Build-time image-alt validation passes for all prerendered HTML.

Remaining: create a distinct guidebook share image if social previews need to differentiate the guide from the property page.

#### 5. Sitemap and indexing

Implemented:

- Added `@astrojs/sitemap` and generated `/sitemap-index.xml` plus `/sitemap-0.xml`.
- Added `public/robots.txt` with sitemap, schema-map, and Content-Signal directives.
- Sitemap `lastmod` values use git history through `gitLastmod` in `astro.config.mjs`.
- No RSS feed was added because this is an accommodation site and evergreen guide, not a dated publication.

Remaining: add IndexNow only after generating and deploying a production key file; do not enable it for local or preview builds.

#### 6. Agent discovery

Implemented:

- Build-generated `/llms.txt` lists the two indexable pages.
- `/index.md` and `/dalvik-travel-guide.md` provide clean Markdown alternates.
- `/.well-known/schema-property`, `/.well-known/schema-guide`, `/schemamap.xml`, and `/.well-known/api-catalog` expose the structured corpus.
- `public/_headers` declares discovery `Link` headers, immutable asset caching, and `No-Vary-Search` for tracking parameters.

The route wrappers in `src/lib/seo-routes.ts` intentionally mirror the package wire formats. They are edge-safe because the package barrel also imports Node-only build utilities that Cloudflare’s prerender worker cannot load.

Remaining: configure Cloudflare content negotiation if requests with `Accept: text/markdown` should be rewritten automatically to the `.md` representation. Direct `.md` URLs already work.

#### 7. Performance and rendering

Implemented:

- The homepage and guide are prerendered HTML; the availability calendar remains the only React island.
- Astro emits hashed assets, and `public/_headers` marks `/_astro/*` and images immutable.
- The availability feed remains separately dynamic and cached.

Remaining:

- The 32 public photos still use raw `<img>` tags; moving them into `src/assets` and Astro’s `<Image>` pipeline would add responsive sizing and format negotiation.
- Google Fonts are still loaded from an external stylesheet; self-hosting or measuring a preload strategy is the next performance pass.

#### 8. Redirects and error handling

Implemented:

- Added a branded prerendered `404.astro` with `noindex` and a package-based `FuzzyRedirect` suggestion.
- Explicit trailing-slash policy is now `always`, and internal-link validation passes without redirect-hop warnings.

Remaining: no historical URL migration table exists. Add `public/_redirects` entries if the old site had published paths that must be preserved.

#### 9. Validation and content quality

Implemented:

- `seoGraph()` runs H1, unique metadata, image alt, metadata length, and internal-link checks during every build.
- Current build output: all checks pass; Markdown alternates verify; `llms.txt` writes two indexable links.
- Guide copy remains Markdown-first and has internal links from the homepage.

Remaining: add an external-link checker such as lychee in GitHub Actions, and run human/readability review on the longer guide entries as content evolves.

### Files generated or changed

- `src/components/BaseHead.astro` — shared metadata, canonical, Open Graph, and graph wiring.
- `src/lib/seo.ts` — linked JSON-LD graph and schema pieces.
- `src/lib/seo-routes.ts` — Cloudflare edge-safe schema/catalog/Markdown route helpers.
- `src/pages/schema/`, `src/pages/schemamap.xml.ts`, `src/pages/.well-known/api-catalog.ts` — discovery endpoints.
- `src/pages/[...slug].md.ts` — Markdown alternates for the public pages and 404.
- `src/pages/404.astro` — branded error page with fuzzy redirect suggestions.
- `public/robots.txt`, `public/_headers`, `public/images/og-hofn.jpg` — indexing, headers, and social image.
- `astro.config.mjs`, `src/content.config.ts`, and package manifests — sitemap, validation, prerendering, and SEO schema configuration.

### Next steps

1. Transfer/activate `hofn.manifesto.is` in Cloudflare and confirm HTTPS DNS resolution.
2. Register the site in Google Search Console and Bing Webmaster Tools, then submit `/sitemap-index.xml`.
3. Run the homepage and guide through Google Rich Results Test and ClassySchema.
4. Add a production-only IndexNow key if faster discovery is useful.
5. Consider Astro `<Image>` migration and self-hosted fonts after measuring the current pages.
