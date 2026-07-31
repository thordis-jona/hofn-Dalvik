import { createApiCatalog } from '../../lib/seo-routes';

export const prerender = true;

export const GET = createApiCatalog({
  siteUrl: 'https://hofn.manifesto.is',
  schemaEndpoints: [
    { path: '/schema/site.jsonld', schemaType: 'LodgingBusiness', serviceDoc: '/' },
    { path: '/schema/guide.jsonld', schemaType: 'CreativeWork', serviceDoc: '/dalvik-travel-guide/' },
  ],
  schemaMap: { path: '/schemamap.xml', serviceDoc: '/' },
  additional: [
    { anchor: '/api/availability.json', serviceDoc: '/#laust', type: 'application/json' },
  ],
});
