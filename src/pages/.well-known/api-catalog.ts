import { createApiCatalog } from '../../lib/seo-routes';

export const prerender = false;

export const GET = createApiCatalog({
  siteUrl: 'https://hofn.manifesto.is',
  schemaEndpoints: [
    { path: '/.well-known/schema-property', schemaType: 'LodgingBusiness', serviceDoc: '/' },
    { path: '/.well-known/schema-guide', schemaType: 'CreativeWork', serviceDoc: '/dalvik-travel-guide/' },
  ],
  schemaMap: { path: '/schemamap.xml', serviceDoc: '/' },
  additional: [
    { anchor: '/api/availability.json', serviceDoc: '/#laust', type: 'https://www.iana.org/assignments/media-types/application/json' },
  ],
});
