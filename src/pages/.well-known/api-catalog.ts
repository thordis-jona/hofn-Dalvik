import { createApiCatalog } from '../../lib/seo-routes';

export const prerender = true;

export const GET = createApiCatalog({
  siteUrl: 'https://hofn.manifesto.is',
  schemaEndpoints: [
    { path: '/schema/site.json', schemaType: 'LodgingBusiness', serviceDoc: '/' },
    { path: '/schema/guide.json', schemaType: 'CreativeWork', serviceDoc: '/dalvik-travel-guide/' },
  ],
  schemaMap: { path: '/schemamap.xml', serviceDoc: '/' },
  additional: [
    { anchor: '/api/availability.json', serviceDoc: '/#laust', type: 'application/json' },
  ],
});
