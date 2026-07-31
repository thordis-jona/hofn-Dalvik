import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { contentId, locales, sourceKey, type Locale } from '../i18n/config';

export const copyKeys = ['hero', 'about', 'adventure', 'location', 'booking'] as const;
export type CopyKey = (typeof copyKeys)[number];

type CopyEntry = CollectionEntry<'copy'>;
type GuideEntry = CollectionEntry<'guidebook'>;

export async function getCopy(locale: Locale): Promise<Record<CopyKey, CopyEntry>> {
  const entries = await Promise.all(copyKeys.map((key) => getEntry('copy', contentId(locale, key))));
  const missing = copyKeys.filter((_, index) => !entries[index]);
  if (missing.length > 0) {
    throw new Error(`Missing ${locale} copy entries: ${missing.join(', ')}`);
  }

  return Object.fromEntries(copyKeys.map((key, index) => [key, entries[index]])) as Record<CopyKey, CopyEntry>;
}

export async function getGuideEntries(locale: Locale): Promise<GuideEntry[]> {
  return (await getCollection('guidebook', ({ id }) => id.startsWith(`${locale}/`)))
    .sort((a, b) => a.data.order - b.data.order);
}

function keysFor(entries: { id: string }[]) {
  return entries.map((entry) => sourceKey(entry.id)).sort();
}

function assertSameKeys(collection: string, byLocale: Record<Locale, { id: string }[]>) {
  const expected = JSON.stringify(keysFor(byLocale.is));
  const actual = JSON.stringify(keysFor(byLocale.en));
  if (expected !== actual) {
    throw new Error(`${collection} translation source keys differ between is and en.`);
  }
}

export async function validateContentParity() {
  const [allCopy, allGuide] = await Promise.all([getCollection('copy'), getCollection('guidebook')]);
  const copyByLocale = Object.fromEntries(locales.map((locale) => [locale, allCopy.filter(({ id }) => id.startsWith(`${locale}/`))])) as Record<Locale, CopyEntry[]>;
  const guideByLocale = Object.fromEntries(locales.map((locale) => [locale, allGuide.filter(({ id }) => id.startsWith(`${locale}/`))])) as Record<Locale, GuideEntry[]>;

  if (copyByLocale.is.length !== copyKeys.length || copyByLocale.en.length !== copyKeys.length) {
    throw new Error(`Expected ${copyKeys.length} copy entries per locale; found is=${copyByLocale.is.length}, en=${copyByLocale.en.length}.`);
  }
  if (guideByLocale.is.length !== 19 || guideByLocale.en.length !== 19) {
    throw new Error(`Expected 19 guide entries per locale; found is=${guideByLocale.is.length}, en=${guideByLocale.en.length}.`);
  }

  assertSameKeys('copy', copyByLocale);
  assertSameKeys('guidebook', guideByLocale);

  const englishGuide = new Map(guideByLocale.en.map((entry) => [sourceKey(entry.id), entry]));
  const seenOrders = new Set<number>();
  for (const entry of guideByLocale.is) {
    const key = sourceKey(entry.id);
    const translated = englishGuide.get(key);
    if (!translated) throw new Error(`Missing English guide entry for ${key}.`);
    if (seenOrders.has(entry.data.order)) throw new Error(`Duplicate guide order ${entry.data.order}.`);
    seenOrders.add(entry.data.order);

    for (const field of ['order', 'image', 'imageSource', 'link'] as const) {
      if (entry.data[field] !== translated.data[field]) {
        throw new Error(`Shared guide metadata differs for ${key}: ${field}.`);
      }
    }
  }
}
