import { getCollection } from 'astro:content';
import { SITE_URL } from '../lib/seo';
import { createMarkdownEndpoint } from '../lib/seo-routes';

export const prerender = true;

interface MarkdownPage {
  id: string;
  title: string;
  canonical: string;
  description: string;
  body: string;
}

async function getPages(): Promise<MarkdownPage[]> {
  const copyEntries = await getCollection('copy');
  const guideEntries = (await getCollection('guidebook')).sort((a, b) => a.data.order - b.data.order);
  const copyBody = copyEntries
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((entry) => `## ${entry.data.title}\n\n${entry.body ?? ''}`)
    .join('\n\n');
  const guideBody = guideEntries
    .map((entry) => `## ${entry.data.title}\n\n_${entry.data.category}_\n\n${entry.body ?? ''}`)
    .join('\n\n');

  return [
    {
      id: 'index',
      title: 'Höfn í Dalvík · Hús á Tröllaskaga',
      canonical: `${SITE_URL}/`,
      description: 'Höfn er fallega uppgert hús í hjarta Dalvíkur fyrir allt að átta gesti.',
      body: `# Höfn í Dalvík\n\n${copyBody}`,
    },
    {
      id: 'dalvik-travel-guide',
      title: 'Frjáls ferðahandbók um Dalvík · Höfn',
      canonical: `${SITE_URL}/dalvik-travel-guide/`,
      description: 'Frjáls ferðahandbók frá Höfn um Dalvík, Tröllaskaga og Eyjafjörð.',
      body: `# Ferðahandbók Dalvíkur\n\n${guideBody}`,
    },
    {
      id: '404',
      title: 'Síða fannst ekki · Höfn í Dalvík',
      canonical: `${SITE_URL}/404`,
      description: 'Síðan sem þú leitar að fannst ekki.',
      body: '# Síða fannst ekki\n\nFarðu aftur á forsíðu Höfn í Dalvík.',
    },
  ];
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
