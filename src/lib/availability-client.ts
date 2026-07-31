import { createBrowserClient, fetchTransport } from 'result-rpc/client';
import { appContract } from './availability-contract';

export const availabilityClient = createBrowserClient({
  contract: appContract,
  transport: fetchTransport({ url: '/api/rpc' }),
});
