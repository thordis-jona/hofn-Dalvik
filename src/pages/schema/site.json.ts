import { buildSiteSchemaPieces, SITE_URL } from '../../lib/seo';
import { createSchemaEndpoint } from '../../lib/seo-routes';

export const prerender = false;

const entries = async () => [{ id: 'site' }];

export const GET = createSchemaEndpoint({
  entries,
  mapper: () => buildSiteSchemaPieces({
    url: `${SITE_URL}/`,
    title: 'Höfn í Dalvík · Hús á Tröllaskaga',
    description: 'Höfn er fallega uppgert hús í hjarta Dalvíkur fyrir allt að átta gesti.',
  }),
});
