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
  return null;
}

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'always',
  output: 'server',
  adapter: cloudflare({ configPath: './wrangler.jsonc' }),
  integrations: [
    react(),
    sitemap({
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
        summary: 'Höfn er fallega uppgert hús fyrir allt að átta gesti í hjarta Dalvíkur á Tröllaskaga.',
        details: 'Síðan inniheldur upplýsingar um húsið, lausar dagsetningar og frjálsa ferðahandbók um Dalvík og nágrenni.',
        filter: (url) => !new URL(url).pathname.startsWith('/404'),
      },
      markdownAlternate: true,
    }),
  ],
});
