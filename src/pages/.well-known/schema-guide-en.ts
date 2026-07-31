import { getCollection } from 'astro:content';
import { absoluteLocaleUrl } from '../../i18n/config';
import { ui } from '../../i18n/ui';
import { buildGuideEntrySchemaPiece, buildSiteSchemaPieces } from '../../lib/seo';
import { createSchemaEndpoint } from '../../lib/seo-routes';

export const prerender = true;

export const GET = createSchemaEndpoint({
  entries: () => getCollection('guidebook', ({ id }) => id.startsWith('en/')),
  mapper: (entry) => [
    ...buildSiteSchemaPieces({
      url: absoluteLocaleUrl('en', 'guide'),
      title: ui.en.guide.metadata.title,
      description: ui.en.guide.metadata.description,
      pageType: 'collection',
      locale: 'en',
    }),
    buildGuideEntrySchemaPiece(entry, 'en'),
  ],
});
