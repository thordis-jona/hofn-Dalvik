import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { blockedDatesFromEvents, parseIcalEvents } from '../../lib/ical';

export const prerender = false;

export const GET: APIRoute = async () => {
  const feedUrl = (env as unknown as { AIRBNB_ICAL_URL?: string }).AIRBNB_ICAL_URL;

  if (!feedUrl) {
    return Response.json({ error: 'Availability feed is not configured.' }, { status: 503 });
  }

  let response: Response;
  try {
    response = await fetch(feedUrl, {
      headers: { accept: 'text/calendar,text/plain;q=0.9' },
      cf: { cacheTtl: 900, cacheEverything: true },
    } as RequestInit & { cf: { cacheTtl: number; cacheEverything: boolean } });
  } catch {
    return Response.json({ error: 'Availability feed could not be reached.' }, { status: 502 });
  }

  if (!response.ok) {
    return Response.json({ error: 'Availability feed returned an error.' }, { status: 502 });
  }

  const events = parseIcalEvents(await response.text());
  return Response.json(
    { blocked: blockedDatesFromEvents(events), updatedAt: new Date().toISOString() },
    { headers: { 'cache-control': 'public, max-age=900, stale-while-revalidate=3600' } },
  );
};
