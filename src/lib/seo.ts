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
import { absoluteLocaleUrl, sourceKey, type Locale } from '../i18n/config';

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
  locale: Locale;
}

const schemaCopy = {
  is: {
    propertyDescription: 'Fallega uppgert einbýlishús í hjarta Dalvíkur fyrir allt að átta gesti.',
    topics: ['Dalvík', 'Tröllaskagi', 'Eyjafjörður', 'skíði', 'gönguferðir', 'hvalaskoðun'],
    websiteDescription: 'Upplýsingar um Höfn, gistingu í Dalvík og ferðahandbók um Tröllaskaga.',
    imageCaption: 'Höfn í Dalvík',
    homeBreadcrumb: 'Höfn · Dalvík',
    guideBreadcrumb: 'Ferðahandbók Dalvíkur',
    guideDescription: (category: string) => `${category} í Dalvík og nágrenni.`,
  },
  en: {
    propertyDescription: 'A beautifully restored house for up to eight guests in the heart of Dalvík, North Iceland.',
    topics: ['Dalvík', 'Tröllaskagi', 'Eyjafjörður', 'skiing', 'hiking', 'whale watching'],
    websiteDescription: 'Information about Höfn, accommodation in Dalvík and a free travel guide to Tröllaskagi.',
    imageCaption: 'Höfn in Dalvík',
    homeBreadcrumb: 'Höfn · Dalvík',
    guideBreadcrumb: 'Dalvík travel guide',
    guideDescription: (category: string) => `${category} in Dalvík and the surrounding area.`,
  },
} as const;

export function buildSiteSchemaPieces({ url, title, description, pageType = 'website', locale }: PageSchemaOptions): GraphEntity[] {
  const copy = schemaCopy[locale];
  const property = buildPiece({
    '@type': 'LodgingBusiness',
    '@id': PROPERTY_ID,
    name: 'Höfn',
    url: `${SITE_URL}/`,
    description: copy.propertyDescription,
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
    knowsAbout: copy.topics,
  });

  const website = buildWebSite(
    {
      url: `${SITE_URL}/`,
      name: SITE_NAME,
      description: copy.websiteDescription,
      publisher: { '@id': PROPERTY_ID },
      inLanguage: locale,
    },
    ids,
  );

  const image = buildImageObject(
    {
      pageUrl: url,
      url: OG_IMAGE_URL,
      width: 1200,
      height: 675,
      inLanguage: locale,
      caption: copy.imageCaption,
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
      inLanguage: locale,
      isAccessibleForFree: true,
    },
    ids,
    pageType === 'collection' ? 'CollectionPage' : 'WebPage',
  );

  const breadcrumb = buildBreadcrumbList(
    {
      url,
      items: [
        { name: copy.homeBreadcrumb, url: absoluteLocaleUrl(locale, 'home') },
        ...(pageType === 'collection' ? [{ name: copy.guideBreadcrumb, url }] : []),
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
}, locale: Locale) {
  const pageUrl = absoluteLocaleUrl(locale, 'guide');
  return buildPiece({
    '@type': 'CreativeWork',
    '@id': `${pageUrl}#${locale}-${sourceKey(entry.id)}`,
    name: entry.data.title,
    description: schemaCopy[locale].guideDescription(entry.data.category),
    articleSection: entry.data.category,
    inLanguage: locale,
    isPartOf: { '@id': ids.webPage(pageUrl) },
    url: entry.data.link ?? pageUrl,
    isAccessibleForFree: true,
  });
}

export { ids };
