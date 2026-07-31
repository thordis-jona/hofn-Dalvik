import { env } from 'cloudflare:workers';
import { err, gen, tryPromise } from 'result-rpc';
import type { Result } from 'result-rpc';
import { availabilityErrors, type AvailabilityData } from './availability-contract';
import { blockedDatesFromEvents, parseIcalEvents } from './ical';

export function getAvailability(signal?: AbortSignal): Promise<Result<AvailabilityData, ReturnType<typeof availabilityErrors.unavailable>>> {
  const feedUrl = env.AIRBNB_ICAL_URL;

  if (!feedUrl) {
    return Promise.resolve(err(availabilityErrors.unavailable()));
  }

  return gen(async function* () {
    const response = yield* await tryPromise(
      () =>
        fetch(feedUrl, {
          signal,
          headers: { accept: 'text/calendar,text/plain;q=0.9' },
          cf: { cacheTtl: 900, cacheEverything: true },
        } as RequestInit & { cf: { cacheTtl: number; cacheEverything: boolean } }),
      () => availabilityErrors.unavailable(),
    );

    if (!response.ok) return yield* err(availabilityErrors.unavailable());

    const body = yield* await tryPromise(
      () => response.text(),
      () => availabilityErrors.unavailable(),
    );

    return {
      blocked: blockedDatesFromEvents(parseIcalEvents(body)),
      updatedAt: new Date(),
    };
  });
}
