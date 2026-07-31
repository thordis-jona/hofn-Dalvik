import { deduplicateByGraphId, type GraphEntity } from '@jdevalk/seo-graph-core';

type EntryMapper<Entry> = (entry: Entry) => ReadonlyArray<GraphEntity>;

export function createSchemaEndpoint<Entry>(options: {
  entries: () => Promise<readonly Entry[]>;
  mapper: EntryMapper<Entry>;
}) {
  return async () => {
    const entries = await options.entries();
    const pieces = entries.flatMap(options.mapper);
    const graph = {
      '@context': 'https://schema.org',
      '@graph': deduplicateByGraphId(pieces),
    };

    return new Response(JSON.stringify(graph, null, 2), {
      headers: {
        'Cache-Control': 'max-age=300',
        'Content-Type': 'application/ld+json',
        'X-Robots-Tag': 'noindex, follow',
      },
    });
  };
}

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export function createSchemaMap(options: {
  siteUrl: string;
  entries: ReadonlyArray<{ path: string; lastModified: Date }>;
}) {
  return async () => {
    const site = options.siteUrl.replace(/\/+$/, '');
    const urls = options.entries.map((entry) => {
      const path = entry.path.startsWith('/') ? entry.path : `/${entry.path}`;
      return `  <url contentType="structuredData/schema.org">\n    <loc>${escapeXml(`${site}${path}`)}</loc>\n    <lastmod>${entry.lastModified.toISOString().split('T')[0]}</lastmod>\n  </url>`;
    }).join('\n');
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;

    return new Response(xml, {
      headers: {
        'Cache-Control': 'max-age=300',
        'Content-Type': 'application/xml',
        'X-Robots-Tag': 'noindex, follow',
      },
    });
  };
}

export function createApiCatalog(options: {
  siteUrl: string;
  schemaEndpoints: ReadonlyArray<{ path: string; schemaType: string; serviceDoc?: string }>;
  schemaMap: { path: string; serviceDoc?: string };
  additional?: ReadonlyArray<{ anchor: string; serviceDoc?: string; type?: string }>;
}) {
  return async () => {
    const site = options.siteUrl.replace(/\/+$/, '');
    const absolute = (path: string) => /^https?:\/\//i.test(path) ? path : `${site}${path.startsWith('/') ? path : `/${path}`}`;
    const linkset = [
      ...options.schemaEndpoints.map((entry) => ({
        anchor: absolute(entry.path),
        'service-doc': entry.serviceDoc ? [{ href: absolute(entry.serviceDoc) }] : undefined,
        type: [{ href: `https://schema.org/${entry.schemaType}` }],
      })),
      {
        anchor: absolute(options.schemaMap.path),
        'service-doc': options.schemaMap.serviceDoc ? [{ href: absolute(options.schemaMap.serviceDoc) }] : undefined,
      },
      ...(options.additional ?? []).map((entry) => ({
        anchor: absolute(entry.anchor),
        'service-doc': entry.serviceDoc ? [{ href: absolute(entry.serviceDoc) }] : undefined,
        type: entry.type ? [{ href: absolute(entry.type) }] : undefined,
      })),
    ];

    return new Response(JSON.stringify({ linkset }, null, 2), {
      headers: {
        'Cache-Control': 'max-age=300',
        'Content-Type': 'application/linkset+json',
        'X-Robots-Tag': 'noindex, follow',
      },
    });
  };
}

function yamlValue(value: string) {
  return /[:#[\]{}"'`,&*!|>%@]/.test(value) ? JSON.stringify(value) : value;
}

export function renderMarkdownAlternate(options: {
  title: string;
  canonical: string;
  description: string;
  body: string;
}) {
  const markdown = [
    '---',
    `title: ${yamlValue(options.title)}`,
    `canonical: ${yamlValue(options.canonical)}`,
    `description: ${yamlValue(options.description)}`,
    '---',
    '',
    options.body.trim(),
    '',
  ].join('\n');
  return { markdown, tokenCount: Math.ceil(markdown.length / 4) };
}

export function createMarkdownEndpoint<Entry>(options: {
  entries: () => Promise<readonly Entry[]>;
  mapper: (entry: Entry, slug: string) => { title: string; canonical: string; description: string; body: string } | null;
}) {
  return async ({ params }: { params?: Record<string, string | undefined> }) => {
    const slug = params?.slug ?? '';
    const entries = await options.entries();
    const entry = entries.find((candidate) => options.mapper(candidate, slug) !== null);
    const input = entry ? options.mapper(entry, slug) : null;
    if (!input) return new Response('Not found', { status: 404 });

    const rendered = renderMarkdownAlternate(input);
    return new Response(rendered.markdown, {
      headers: {
        'Cache-Control': 'max-age=300',
        'Content-Type': 'text/markdown; charset=utf-8',
        'Link': `<${input.canonical}>; rel="canonical"`,
        'X-Markdown-Tokens': String(rendered.tokenCount),
        'X-Robots-Tag': 'noindex, follow',
      },
    });
  };
}
