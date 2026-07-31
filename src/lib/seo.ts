import {
  assembleGraph,
  buildBreadcrumbList,
  buildImageObject,
  buildPiece,
  buildWebPage,
  buildWebSite,
  makeIds,
  type GraphEntity,
} from '@jdevalk/seo-graph-core';

export const SITE_URL = 'https://hofn.manifesto.is';
export const SITE_NAME = 'Höfn · Dalvík';
export const OG_IMAGE_URL = `${SITE_URL}/images/og-hofn.jpg`;
export const PROPERTY_ID = 'https://hofn.manifesto.is/#property';

const ids = makeIds({ siteUrl: SITE_URL });

type PageType = 'website' | 'collection';

interface PageSchemaOptions {
  url: string;
  title: string;
  description: string;
  pageType?: PageType;
}

export function buildSiteSchemaPieces({ url, title, description, pageType = 'website' }: PageSchemaOptions): GraphEntity[] {
  const property = buildPiece({
    '@type': 'LodgingBusiness',
    '@id': PROPERTY_ID,
    name: 'Höfn',
    url: `${SITE_URL}/`,
    description: 'Fallega uppgert einbýlishús í hjarta Dalvíkur fyrir allt að átta gesti.',
    image: { '@id': ids.primaryImage(url) },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Karlsrauðatorg 4',
      postalCode: '620',
      addressLocality: 'Dalvík',
      addressCountry: 'IS',
    },
    numberOfRooms: 4,
    maximumAttendeeCapacity: 8,
    knowsAbout: ['Dalvík', 'Tröllaskagi', 'Eyjafjörður', 'skíði', 'gönguferðir', 'hvalaskoðun'],
  });

  const website = buildWebSite(
    {
      url: `${SITE_URL}/`,
      name: SITE_NAME,
      description: 'Upplýsingar um Höfn, gistingu í Dalvík og ferðahandbók um Tröllaskaga.',
      publisher: { '@id': PROPERTY_ID },
      inLanguage: 'is',
    },
    ids,
  );

  const image = buildImageObject(
    {
      pageUrl: url,
      url: OG_IMAGE_URL,
      width: 1200,
      height: 675,
      inLanguage: 'is',
      caption: 'Höfn í Dalvík',
    },
    ids,
  );

  const page = buildWebPage(
    {
      url,
      name: title,
      description,
      isPartOf: { '@id': ids.website },
      breadcrumb: { '@id': ids.breadcrumb(url) },
      primaryImage: { '@id': ids.primaryImage(url) },
      about: { '@id': PROPERTY_ID },
      inLanguage: 'is',
      isAccessibleForFree: true,
    },
    ids,
    pageType === 'collection' ? 'CollectionPage' : 'WebPage',
  );

  const breadcrumb = buildBreadcrumbList(
    {
      url,
      items: [
        { name: 'Höfn · Dalvík', url: `${SITE_URL}/` },
        ...(pageType === 'collection' ? [{ name: 'Ferðahandbók Dalvíkur', url }] : []),
      ],
    },
    ids,
  );

  return [property, website, image, page, breadcrumb];
}

export function buildSiteSchemaGraph(options: PageSchemaOptions) {
  return assembleGraph(buildSiteSchemaPieces(options), { warnOnDanglingReferences: true });
}

export function buildGuideEntrySchemaPiece(entry: {
  id: string;
  data: { title: string; category: string; link?: string };
}) {
  const pageUrl = `${SITE_URL}/dalvik-travel-guide/`;
  return buildPiece({
    '@type': 'CreativeWork',
    '@id': `${pageUrl}#${entry.id}`,
    name: entry.data.title,
    description: `${entry.data.category} í Dalvík og nágrenni.`,
    articleSection: entry.data.category,
    inLanguage: 'is',
    isPartOf: { '@id': ids.webPage(pageUrl) },
    url: entry.data.link ?? pageUrl,
    isAccessibleForFree: true,
  });
}

export { ids };
