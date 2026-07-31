# English localization plan

Status: ready for implementation

Prepared: 2026-07-31

Framework baseline: Astro 7.1.6 (latest stable on npm at the time of this assessment)

## Outcome

Add a complete English version of the public site while preserving the current Icelandic URLs and visual design.

The public route pairs will be:

| Icelandic (default) | English |
| --- | --- |
| `/` | `/en/` |
| `/dalvik-travel-guide/` | `/en/dalvik-travel-guide/` |

Icelandic remains the unprefixed default. There will be no `/is/` routes, browser-language redirect, or fallback that serves Icelandic content at an English URL.

The implementation will use Astro's built-in path-based i18n routing. It does not need an additional translation framework or a runtime translation service.

## Scope assessment

This is a medium-sized localization and refactoring task, not just two translated page files.

Current translation surface:

- 2 indexable HTML pages and 1 custom 404 page.
- 24 Markdown entries: 5 house-copy sections and 19 travel-guide entries.
- About 1,109 words in Markdown bodies and translatable frontmatter.
- Approximately 190–220 additional UI, accessibility, validation, email, data, and SEO strings.
- About 1,600–1,900 source words and roughly 300 translation units in total.
- 28 gallery captions/alts, plus room and guide image descriptions that must be translated even though the underlying images are shared.
- 2 localized React islands: the availability calendar and inquiry form.
- Machine-readable representations: Markdown alternates, JSON-LD, sitemap, `llms.txt`, schema endpoints, schema map, and API catalog.

The availability data, Result RPC contract, iCal parsing, Worker bindings, R2 binding, and cached API endpoints are locale-neutral and do not need to be duplicated.

## Architecture decision

### Astro routing

Add the following explicit configuration to `astro.config.mjs`:

```js
i18n: {
  defaultLocale: 'is',
  locales: ['is', 'en'],
  routing: {
    prefixDefaultLocale: false,
    redirectToDefaultLocale: false,
  },
},
```

This preserves the existing URLs and places English pages under `src/pages/en/`. Although both routing values are currently false by default, keeping them explicit protects the site's URL contract across Astro upgrades.

Do not add `fallback: { en: 'is' }`. An English URL must contain English content; a missing English route should fail visibly instead of producing mixed-language pages and incorrect SEO signals.

Use `getRelativeLocaleUrl()` and `getAbsoluteLocaleUrl()` from `astro:i18n` for corresponding-page links, language switching, canonicals, and alternates. Do not concatenate `/en` manually.

Relevant official documentation:

- [Astro internationalization routing](https://docs.astro.build/en/guides/internationalization/)
- [`astro:i18n` URL helpers](https://docs.astro.build/en/reference/modules/astro-i18n/)
- [Astro i18n configuration reference](https://docs.astro.build/en/reference/configuration-reference/#i18n)
- [Localized sitemap support](https://docs.astro.build/en/guides/integrations-guide/sitemap/#i18n)
- [Cloudflare adapter](https://docs.astro.build/en/guides/integrations-guide/cloudflare/)

The site must remain path-based on `hofn.manifesto.is`. Astro's locale-domain feature is not appropriate here: the official support is limited to fully server-rendered Node and Vercel deployments and is incompatible with this site's prerendered Cloudflare pages.

### Shared page structure

Avoid copying the entire existing pages into `src/pages/en/`. Introduce shared page and layout components, then keep all four route files as thin locale wrappers.

Target structure:

```text
src/
  components/
    pages/
      HomePage.astro
      GuidePage.astro
      ErrorPage.astro
  i18n/
    config.ts
    content.ts
    ui/
      is.ts
      en.ts
  layouts/
    SiteLayout.astro
  pages/
    index.astro
    dalvik-travel-guide.astro
    404.astro
    en/
      index.astro
      dalvik-travel-guide.astro
      404.astro
```

Responsibilities:

- `SiteLayout.astro`: `<html lang>`, fonts, shared head, navigation, language switcher, footer, and shared shell.
- `HomePage.astro`: the existing homepage sections and lightbox, parameterized by locale.
- `GuidePage.astro`: the full guide page, parameterized by locale.
- Route files: set `prerender = true`, select a locale, and render the shared page.
- `src/i18n/config.ts`: `Locale` type, locale metadata, route keys, corresponding-page URL helpers, and exhaustive locale guards.
- `src/i18n/ui/*.ts`: short UI, ARIA, form, calendar, mailto, metadata, and structured-card strings.

Use TypeScript's `satisfies` operator so the Icelandic and English dictionaries must expose the same keys at build time.

### Markdown-first content

Follow Astro's official i18n content-collection recipe: keep one collection per content type and organize locale variants in subdirectories inside that collection.

```text
src/content/
  copy/
    is/*.md
    en/*.md
  guidebook/
    is/*.md
    en/*.md
```

Keep the same relative filename for translations of the same source, for example:

```text
src/content/guidebook/is/hauganes-hot-pots.md
src/content/guidebook/en/hauganes-hot-pots.md
```

Astro exposes these as IDs such as `is/hauganes-hot-pots` and `en/hauganes-hot-pots`. A small helper will split the first path segment as the locale and use the remaining relative ID as the stable source key. This follows Astro's documented folder-and-entry-ID pattern and avoids redundant `locale` or `translationKey` frontmatter that could drift out of sync with the filesystem.

Before creating English files, rename the 10 misleading Icelandic guide filenames to accurate, durable source keys. These IDs are not public URLs today, so the cleanup does not change any published route. Once cleaned, filename/source-key changes should be treated like identifier migrations and made in both locale folders together.

Do not create separate `copyIs`, `copyEn`, `guidebookIs`, and `guidebookEn` collections. They contain the same content types and should share one schema. Do not add `astro-i18next`, a CMS, or a locale content-loader package for this corpus: Astro's built-in content collections already provide the folder identity, schema validation, querying, and rendering required here. A specialized loader becomes worthwhile only if translations later move to a remote service or a much larger editorial workflow.

Add typed content helpers along these lines:

```ts
type Locale = 'is' | 'en';

function localizedId(locale: Locale, sourceKey: string) {
  return `${locale}/${sourceKey}`;
}

function sourceKey(id: string) {
  return id.split('/').slice(1).join('/');
}
```

Use `getEntry(collection, localizedId(locale, key))` for the five named copy sections, and filter `getCollection()` by the locale prefix for the guide. Route generation does not need to be driven by these entries because the site has two fixed aggregate pages, not one public page per Markdown file.

For example:

```ts
const hero = await getEntry('copy', `${locale}/hero`);

const guideEntries = (await getCollection(
  'guidebook',
  ({ id }) => id.startsWith(`${locale}/`),
)).sort((a, b) => a.data.order - b.data.order);
```

This convention is supported from three directions:

- [Astro's official i18n recipe](https://docs.astro.build/en/recipes/i18n/#use-collections-for-translated-content) recommends locale subdirectories inside one content-type collection and derives language from `entry.id`.
- [Astro's content collection guide](https://docs.astro.build/en/guides/content-collections/#filtering-collection-queries) supports filtering nested entries through collection IDs.
- [Starlight's official i18n guide](https://starlight.astro.build/guides/i18n/#configure-i18n) explicitly recommends identical filenames to associate pages across languages.

Retain the existing Astro 7 `glob()` loaders. Do not copy the loaderless syntax from older recipe snippets. Also avoid a frontmatter field named `slug` for translation identity because the glob loader treats it as an entry-ID override; if localized public slugs are ever needed, use a separate field such as `routeSlug`.

At build time, validate that:

- each locale has exactly 5 copy entries and 19 guide entries;
- the relative entry-ID/source-key sets are identical across `is/` and `en/`;
- each source key is unique within its collection and locale;
- guide order is unique within each locale;
- non-translatable guide metadata (`order`, image, source, and external link) agrees across each pair;
- required translated image alt text is present.

Long prose, guide descriptions, and section copy stay in Markdown. Short labels and structured card text remain in typed dictionaries because their icons, image filenames, field names, and validation rules are application structure rather than prose.

## Implementation phases

### Phase 1 — Routing and shared shell

1. Add Astro i18n configuration for `is` and `en`.
2. Add typed locale and route helpers.
3. Extract the repeated HTML shell, navigation, fonts, footer, and head into `SiteLayout.astro`.
4. Add an accessible language switcher to the header:
   - use `Íslenska` and `English`, not flags;
   - link to the equivalent page, not always the homepage;
   - set `lang`, `hreflang`, and `aria-current="page"` correctly;
   - keep the current Icelandic design language and spacing.
5. Extract shared home, guide, and error page components.
6. Create thin Icelandic and English route wrappers, all prerendered.

Keep existing Icelandic anchor IDs stable to avoid breaking bookmarks. English pages may use English section IDs, with their navigation links supplied by the locale dictionary.

### Phase 2 — Content model and English editorial pass

1. Rename misleading guide filenames to durable source keys, then move current Markdown into `is/` directories.
2. Create 24 corresponding English Markdown files.
3. Translate all frontmatter, including titles, categories, SEO fields, image alts, and notes.
4. Translate the structured data currently in `src/data/site.ts`:
   - 28 gallery alt/caption strings;
   - room floor labels, names, alts, and details;
   - feature titles and descriptions;
   - location-point titles and descriptions;
   - adventure titles and descriptions.
5. Translate all page-shell copy, navigation, buttons, lightbox labels, map title, footer text, and Airbnb CTA.

Editorial conventions:

- Use natural international/British English (`en-GB`) for UI dates and wording.
- Preserve Icelandic place names and business names, including diacritics.
- Translate explanatory categories and descriptions, not proper names.
- Keep factual claims, distances, licence details, and seasonal caveats aligned between languages.
- Reuse the same images and external source URLs unless an English-specific destination is verified.

The initial English translation can be implemented in-repo, but a final human editorial review is required before considering the translation approved.

### Phase 3 — React islands and inquiry workflow

#### Availability calendar

Pass `locale` and a calendar message object from Astro into `AvailabilityCalendar`.

- Use `is-IS` for Icelandic and `en-GB` for English in `I18nProvider`.
- Translate status messages, title, instructions, legend, selected-date label, month navigation labels, and all ARIA text.
- Preserve Monday as the first day of the week.
- Preserve the existing states: available, unavailable, past/invalid, and selected.
- Keep past dates and blocked dates non-interactive in both languages.
- Keep the shared Result RPC query, 15-minute stale time, SWR behavior, and locale-neutral availability endpoint unchanged.
- Verify that Airbnb arrival-date deep links remain correct from both language routes.

#### Inquiry form

Pass `locale` and typed form messages into `InquiryForm`.

- Convert the module-level Valibot schema into a schema factory that receives localized messages.
- Keep one validation rule set; localize only its messages.
- Translate every Formisch field label, placeholder, note, submission state, and validation error.
- Translate the generated email subject and body labels for English visitors.
- Fix the existing date-boundary risk while touching this code: `todayIso()` currently uses UTC, while the calendar uses the visitor's local date. Use a consistent calendar-date source so overseas visitors do not see a one-day disagreement.

### Phase 4 — SEO and machine-readable localization

This phase is required for launch, not optional polish.

1. Make `BaseHead.astro` accept locale and corresponding route URLs.
2. Emit the correct values per route:
   - `<html lang="is">` or `<html lang="en">`;
   - self-referential canonical;
   - Open Graph locale (`is_IS` or `en_GB`);
   - localized title, description, author/alt strings;
   - reciprocal `hreflang="is"` and `hreflang="en"`;
   - `hreflang="x-default"` pointing to the unprefixed Icelandic URL.
3. Use the installed `@jdevalk/astro-seo-graph` `alternates` support so every page includes itself and its counterpart.
4. Add `@astrojs/sitemap` i18n configuration:

   ```js
   i18n: {
     defaultLocale: 'is',
     locales: { is: 'is', en: 'en' },
   }
   ```

5. Extend `sourceFileForUrl()` so all four public routes receive accurate git-based `lastmod` values.
6. Make the JSON-LD builders locale-aware:
   - localize descriptions, breadcrumbs, topics, and `inLanguage`;
   - keep shared business facts and the property identity stable;
   - give language-specific guide entities non-colliding `@id` values.
7. Extend the Markdown endpoint with English representations:
   - `/index.md` for `/`;
   - `/dalvik-travel-guide.md` for the Icelandic guide;
   - `/en.md` for `/en/`;
   - `/en/dalvik-travel-guide.md` for the English guide.
8. Remove the unnecessary `404.md` representation or ensure the global Markdown-alternate integration does not advertise it.
9. Make `llms.txt` language-neutral or explicitly bilingual, and include all four indexable pages without mixing an Icelandic-only introduction with English links.
10. Update the schema property/guide endpoints, schema map, API catalog, robots/discovery headers, and `SEO.md` so their multilingual behavior is accurate.
11. Keep fuzzy 404 suggestions within the current locale. Confirm that unknown English paths return English copy with HTTP 404.

The sitemap's i18n option adds language alternates to the sitemap, but it does not add `hreflang` links to each HTML `<head>`; both layers must be implemented.

### Phase 5 — Validation and release

Run the normal typed Cloudflare workflow and build:

1. `npm run types`
2. `npm run build`
3. Inspect generated route output, HTML heads, sitemap, Markdown alternates, schema endpoints, and Worker asset manifest.
4. Test the site at desktop and mobile widths in both languages, with special attention to the wider English navigation and headings.
5. Commit to `main`, push, deploy through Wrangler, and smoke-test the production domain.

## Acceptance criteria

### Routing and language

- `/` and `/dalvik-travel-guide/` remain Icelandic and canonicalize to themselves.
- `/en/` and `/en/dalvik-travel-guide/` render complete English pages with `lang="en"`.
- No `/is/` routes or automatic browser-language redirects are introduced.
- No English route falls back to Icelandic content.
- The language switcher always opens the matching page in the other language.
- All navigation fragments resolve and keyboard focus behavior remains correct.

### Content completeness

- Both locales contain exactly 5 copy entries and 19 guide entries.
- Their relative entry-ID/source-key sets match exactly.
- No visible Icelandic UI, validation, status, accessibility, or email strings leak onto English routes.
- Every translated image has an appropriate English alt/caption; decorative images remain correctly empty where applicable.
- A human reviews the English wording and factual equivalence.

### Calendar and form

- English month/day names, status messages, legend, selected state, and ARIA labels are correct.
- Available, unavailable, past, and selected dates retain their current visual and interactive behavior.
- Both locales use the same availability data and caching behavior.
- Every Formisch/Valibot validation path produces the correct language.
- Calendar-selected arrival dates continue to populate the inquiry form and Airbnb deep link.
- Local date boundaries agree between the calendar and form for Icelandic and overseas time zones.

### SEO and discovery

- Each public page has a unique localized title and description.
- Canonicals point to the same-language URL.
- Every route pair emits reciprocal self-referential `is`, `en`, and `x-default` alternates.
- The sitemap contains exactly four indexable HTML URLs with matching language alternates; neither 404 is indexed.
- JSON-LD uses the correct URL and `inLanguage`, without cross-language `@id` collisions.
- All four HTML routes advertise a working Markdown alternate in the same language.
- `llms.txt`, schema endpoints, schema map, and API catalog accurately represent both languages.
- Existing SEO graph checks pass: H1, unique metadata, metadata length, image alt, internal links, and Markdown alternate validation.

### Hosting

- All four public pages remain prerendered static assets.
- Availability endpoints continue to run through the existing Cloudflare Worker and typed bindings.
- No translation asset requires a new R2 object; the existing `MEDIA` binding remains untouched by this project phase.
- Production deployment succeeds at `https://hofn.manifesto.is` with no horizontal overflow regression.

## Risks and mitigations

| Risk | Mitigation |
| --- | --- |
| Page duplication makes future edits drift | Thin route wrappers plus shared page/layout components |
| Guide entries pair with the wrong translation | Clean semantic source keys once, mirror relative filenames across locale folders, and validate the ID sets |
| Icelandic strings leak from React modules | Pass locale-specific message objects into islands and schema factories |
| English routes create duplicate-content signals | No fallback; locale-aware canonical, `hreflang`, sitemap, and JSON-LD |
| English navigation overflows | Responsive QA at narrow widths before deployment |
| Mixed-language machine output | Treat Markdown, `llms.txt`, schema routes, and discovery files as launch scope |
| UTC/local date mismatch affects overseas visitors | Unify form and calendar date calculation during island localization |
| Fuzzy 404 crosses languages | Filter suggestions by locale and test both unknown-path cases |
| Translation changes facts or tone | Preserve a one-to-one key structure and require final human review |

## Non-goals

- No CMS, runtime translation API, or machine-translation dependency.
- No automatic locale selection from `Accept-Language`.
- No English subdomain or second domain.
- No duplicate image upload or new R2 asset hierarchy solely for translation.
- No changes to availability synchronization, Result RPC wire format, SWR policy, or Airbnb iCal ingestion.
- No translation of third-party websites reached through travel-guide links unless an official English URL exists.

## Recommended implementation order

Execute this as two focused passes:

1. Architecture pass: routing, shared layout/pages, content schema, locale dictionaries, islands, SEO plumbing, and tests using complete Icelandic data in the new structure.
2. Editorial pass: add all English content, review copy, run visual/SEO validation, deploy, and production smoke-test.

This order makes missing translations and structural mismatches build-time errors instead of allowing a partially English site to reach production.
