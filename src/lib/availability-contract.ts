import { defineErrors, rpc, wire } from 'result-rpc';

const app = rpc.context<{}>();

export const availabilityErrors = defineErrors('availability', {
  unavailable: {
    httpStatus: 503,
    retry: 'transient',
  },
});

export const availability = app
  .procedure()
  .input(wire.object({}))
  .output(
    wire.object({
      blocked: wire.array(wire.string),
      updatedAt: wire.date,
    }),
  )
  .errors(availabilityErrors)
  .query();

export const appContract = app.contract({ availability });

export type AvailabilityData = {
  readonly blocked: readonly string[];
  readonly updatedAt: Date;
};
