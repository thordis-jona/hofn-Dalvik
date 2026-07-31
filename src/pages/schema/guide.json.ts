import { getCollection } from 'astro:content';
import { buildGuideEntrySchemaPiece, buildSiteSchemaPieces, SITE_URL } from '../../lib/seo';
import { createSchemaEndpoint } from '../../lib/seo-routes';

export const prerender = true;

export const GET = createSchemaEndpoint({
  entries: () => getCollection('guidebook'),
  mapper: (entry) => [
    ...buildSiteSchemaPieces({
      url: `${SITE_URL}/dalvik-travel-guide/`,
      title: 'Frjáls ferðahandbók um Dalvík · Höfn',
      description: 'Frjáls ferðahandbók frá Höfn um Dalvík, Tröllaskaga og Eyjafjörð.',
      pageType: 'collection',
    }),
    buildGuideEntrySchemaPiece(entry),
  ],
});
