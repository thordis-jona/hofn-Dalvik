import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import seoGraph from '@jdevalk/astro-seo-graph/integration';
import { gitLastmod } from '@jdevalk/astro-seo-graph';

const SITE_URL = 'https://hofn.manifesto.is';

function sourceFileForUrl(url) {
  const pathname = new URL(url).pathname;
  if (pathname === '/') return 'src/pages/index.astro';
  if (pathname === '/dalvik-travel-guide' || pathname === '/dalvik-travel-guide/') return 'src/pages/dalvik-travel-guide.astro';
  if (pathname === '/en' || pathname === '/en/') return 'src/pages/en/index.astro';
  if (pathname === '/en/dalvik-travel-guide' || pathname === '/en/dalvik-travel-guide/') return 'src/pages/en/dalvik-travel-guide.astro';
  return null;
}

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'always',
  output: 'server',
  adapter: cloudflare({ configPath: './wrangler.jsonc' }),
  i18n: {
    defaultLocale: 'is',
    locales: ['is', 'en'],
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
  },
  integrations: [
    react(),
    sitemap({
      i18n: {
        defaultLocale: 'is',
        locales: { is: 'is', en: 'en' },
      },
      serialize(item) {
        const sourceFile = sourceFileForUrl(item.url);
        const lastModified = sourceFile ? gitLastmod(sourceFile) : null;
        if (lastModified) item.lastmod = lastModified;
        return item;
      },
    }),
    seoGraph({
      validateH1: true,
      validateUniqueMetadata: true,
      validateImageAlt: true,
      validateMetadataLength: true,
      validateInternalLinks: {
        skip: (href) => href.startsWith('/api/') || href.endsWith('.md'),
      },
      llmsTxt: {
        title: 'Höfn · Dalvík',
        siteUrl: SITE_URL,
        summary: 'Höfn is a restored house for up to eight guests in the heart of Dalvík on Iceland’s Tröllaskagi peninsula.',
        details: 'The site is available in Icelandic and English and includes house information, live availability, and a free travel guide to Dalvík and the surrounding area.',
        filter: (url) => !new URL(url).pathname.split('/').includes('404'),
      },
      markdownAlternate: false,
    }),
  ],
});
