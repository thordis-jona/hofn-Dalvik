import type { APIRoute } from 'astro';
import { getAvailability } from '../../lib/availability';

export const prerender = false;

export const GET: APIRoute = async () => {
  const result = await getAvailability();
  if (!result.ok) {
    return Response.json({ error: result.error.name }, { status: 503 });
  }

  return Response.json(result.value, {
    headers: { 'cache-control': 'public, max-age=900, stale-while-revalidate=3600' },
  });
};
