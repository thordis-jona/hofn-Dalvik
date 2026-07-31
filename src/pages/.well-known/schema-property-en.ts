import { absoluteLocaleUrl } from '../../i18n/config';
import { ui } from '../../i18n/ui';
import { buildSiteSchemaPieces } from '../../lib/seo';
import { createSchemaEndpoint } from '../../lib/seo-routes';

export const prerender = true;

const entries = async () => [{ id: 'site-en' }];

export const GET = createSchemaEndpoint({
  entries,
  mapper: () => buildSiteSchemaPieces({
    url: absoluteLocaleUrl('en', 'home'),
    title: ui.en.home.metadata.title,
    description: ui.en.home.metadata.description,
    locale: 'en',
  }),
});
