import { absoluteLocaleUrl, type Locale } from '../i18n/config';
import { ui } from '../i18n/ui';
import { copyKeys, getCopy, getGuideEntries, validateContentParity } from '../lib/content';
import { createMarkdownEndpoint } from '../lib/seo-routes';

export const prerender = true;

interface MarkdownPage {
  id: string;
  title: string;
  canonical: string;
  description: string;
  body: string;
}

async function pagesForLocale(locale: Locale): Promise<MarkdownPage[]> {
  const [copy, guideEntries] = await Promise.all([getCopy(locale), getGuideEntries(locale)]);
  const copyBody = copyKeys
    .map((key) => copy[key])
    .map((entry) => `## ${entry.data.title}\n\n${entry.body ?? ''}`)
    .join('\n\n');
  const guideBody = guideEntries
    .map((entry) => `## ${entry.data.title}\n\n_${entry.data.category}_\n\n${entry.body ?? ''}`)
    .join('\n\n');
  const prefix = locale === 'en' ? 'en/' : '';
  const homeHeading = locale === 'is' ? 'Höfn í Dalvík' : 'Höfn in Dalvík';
  const guideHeading = locale === 'is' ? 'Ferðahandbók Dalvíkur' : 'Dalvík travel guide';
  const messages = ui[locale];

  return [
    {
      id: locale === 'is' ? 'index' : 'en',
      title: messages.home.metadata.title,
      canonical: absoluteLocaleUrl(locale, 'home'),
      description: messages.home.metadata.description,
      body: `# ${homeHeading}\n\n${copyBody}`,
    },
    {
      id: `${prefix}dalvik-travel-guide`,
      title: messages.guide.metadata.title,
      canonical: absoluteLocaleUrl(locale, 'guide'),
      description: messages.guide.metadata.description,
      body: `# ${guideHeading}\n\n${guideBody}`,
    },
  ];
}

async function getPages(): Promise<MarkdownPage[]> {
  await validateContentParity();
  return (await Promise.all([pagesForLocale('is'), pagesForLocale('en')])).flat();
}

export async function getStaticPaths() {
  return (await getPages()).map((page) => ({ params: { slug: page.id } }));
}

export const GET = createMarkdownEndpoint({
  entries: getPages,
  mapper: (page, slug) => page.id !== slug ? null : {
    title: page.title,
    canonical: page.canonical,
    description: page.description,
    body: page.body,
  },
});
