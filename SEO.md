## Astro SEO audit: Höfn · Dalvík

Baseline audit run on 2026-07-31 using the `astro-seo` skill (`jdevalk/skills@astro-seo`). Scores are intentionally conservative and are a starting point for the next SEO pass, not a judgment of the visual design or copy.

### Score

| Category | Score |
| --- | ---: |
| Head metadata | 4/10 |
| JSON-LD graph | 1/10 |
| Content collections and SEO schema | 6/10 |
| Open Graph and social metadata | 2/10 |
| Sitemap and indexing | 2/10 |
| Agent discovery | 0/10 |
| Performance and rendering | 5/10 |
| Redirects and error handling | 3/10 |
| Validation and content quality | 2/10 |
| **Total** | **25/90** |

### Findings

#### 1. Head metadata

Positive:

- `astro.config.mjs` sets `site: 'https://hofn.manifesto.is'`.
- Both public pages have a unique `<title>` and meta description.
- The site is already using Astro server output behind the Cloudflare adapter.

Gaps:

- There is no shared `BaseHead` or `<Seo>` component, so metadata is duplicated and can drift.
- Neither page emits a canonical URL.
- There is no robots meta policy. Add one with a useful `max-snippet`/`max-image-preview` policy when the shared head is introduced.
- There is no language or alternate URL strategy. This is fine for the current Icelandic-only site; add `hreflang` only when another locale exists.

Evidence: `src/pages/index.astro` and `src/pages/dalvik-travel-guide.astro` contain hand-written title and description tags but no canonical tag.

#### 2. JSON-LD graph

No JSON-LD is currently emitted. The homepage has enough information to add a connected graph for the accommodation and local business, with the travel guide represented as a related WebPage. The exact lodging type, address, image URLs, and contact details should be confirmed before publishing structured data.

#### 3. Content collections and SEO schema

Positive:

- `src/content.config.ts` uses Zod schemas for the guidebook and copy collections.
- Guide entries have structured `title`, `category`, `order`, and optional `link` data.
- The full guide is now a stable, indexable route at `/dalvik-travel-guide`.

Gaps:

- The collections do not yet model SEO fields such as `description`, `image`, `alt`, or a stable slug/URL.
- `@jdevalk/astro-seo-graph` is not installed. The current npm registry version checked during the audit is `2.2.0`; evaluate it before adding it to the build.
- The guide content should get a small metadata layer rather than relying only on the first paragraph as a future excerpt.

#### 4. Open Graph and social metadata

There are no `og:*` or `twitter:*` tags. Add shared defaults plus page-specific title, description, canonical URL, and a 1200×630 share image. The source photos generally have descriptive `alt` text; the lightbox image in `src/components/Lightbox.astro` currently uses an empty alt, which should be reviewed for whether it is decorative or needs the selected photo’s description.

#### 5. Sitemap and indexing

- `site` is configured, which is required groundwork for URL generation.
- There is no `@astrojs/sitemap` integration and no generated `sitemap-index.xml`/`sitemap-0.xml`.
- There is no `public/robots.txt` linking crawlers to the sitemap.
- RSS is not a priority for this mostly static accommodation and travel-guide site; add it only if the guide becomes a dated publication.

#### 6. Agent discovery

The project has no `llms.txt`, schema map, API catalog, Content-Signal headers, or equivalent machine-readable discovery layer. This is a small site, so a concise `public/llms.txt` describing Höfn, the property, the guide, and the canonical URLs is the appropriate first step. Do not expose the private availability feed URL in that file.

#### 7. Performance and rendering

Positive:

- The site is primarily static Astro HTML with one React island for the availability calendar.
- The availability query is configured with a 15-minute result-rpc `staleTime`, while the upstream iCal fetch has a 15-minute Cloudflare cache.
- Astro emits hashed client assets during the build.

Gaps:

- Most photos are rendered with raw `<img>` elements instead of Astro’s image pipeline. Audit whether the images can be moved to `astro:assets` without disrupting the existing visual treatment.
- Google Fonts are loaded from an external stylesheet; self-hosting or preconnecting should be considered after measuring the effect.
- The calendar’s current behavior is cache-aware but is not a complete periodic SWR loop: stale data is retained while a query revalidation is triggered, and there is no interval or focus/reconnect refetch enabled.

#### 8. Redirects and error handling

- There is no custom `404.astro` page.
- No `_redirects` file or explicit redirect policy exists.
- The current URL set is small, so this is low risk. Add a branded 404 and preserve any old guide URLs if the site has previously been published under another structure.

#### 9. Validation and content quality

Positive:

- The guide is maintained as Markdown content rather than embedded in page templates.
- The homepage provides internal links to the full guide and the calendar links to the Airbnb property calendar.

Gaps:

- There is no automated validation for missing descriptions, missing image alt text, duplicate titles, canonical URLs, or broken internal/external links.
- There is no SEO graph validation in the build.
- Add a lightweight CI audit once the shared metadata component and sitemap exist.

### Files generated or changed

- Added `SEO.md` with this baseline audit.
- Installed the reusable skill at `/Users/jokull/.agents/skills/astro-seo/SKILL.md` for future SEO work; it is outside the repository.
- No SEO implementation changes were made as part of this baseline audit.

### Next steps

1. Create a shared metadata component with canonical URLs, robots directives, Open Graph, Twitter cards, and page-specific descriptions/images.
2. Add sitemap generation and `robots.txt`.
3. Add validated JSON-LD for the property and the travel guide after confirming the business details.
4. Add `llms.txt`, a custom 404 page, and basic metadata/link validation.
5. Re-run this audit after implementation and compare scores.
