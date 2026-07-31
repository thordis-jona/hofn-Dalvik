import { createSchemaMap } from '../lib/seo-routes';

export const prerender = true;

const lastModified = new Date('2026-07-31T00:00:00.000Z');

export const GET = createSchemaMap({
  siteUrl: 'https://hofn.manifesto.is',
  entries: [
    { path: '/schema/site.jsonld', lastModified },
    { path: '/schema/guide.jsonld', lastModified },
  ],
});
