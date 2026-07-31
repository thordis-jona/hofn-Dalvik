import type { APIRoute } from 'astro';
import { createFetchHandler, serverRpc } from 'result-rpc/server';
import { availability } from '../../lib/availability-contract';
import { getAvailability } from '../../lib/availability';

export const prerender = false;

const server = serverRpc.context<{}>();
const availabilityProcedure = server
  .implement(availability)
  .handler(({ signal }) => getAvailability(signal));
const router = server.router({ availability: availabilityProcedure });
const handler = createFetchHandler({
  router,
  endpoint: '/api/rpc',
  createContext: () => ({}),
});

export const ALL: APIRoute = ({ request }) => handler(request);
