import {
  clubAdminProcedure,
  protectedProcedure,
  publicProcedure,
} from '@/server/api/trpc';
import {
  abortAffiliationRequest,
  acceptAffiliation,
  rejectAffiliation,
  requestAffiliation,
} from '@/server/mutations/player-affiliation';
import getPlayer from '@/server/queries/get-player';
import getPlayersLastTmts from '@/server/queries/get-players-last-tmts';
import { z } from 'zod';

export const playerRouter = {
  info: publicProcedure
    .input(z.object({ playerId: z.string() }))
    .query(async (opts) => {
      const { input } = opts;
      return await getPlayer(input.playerId);
    }),
  playersLastTournaments: publicProcedure
    .input(z.object({ playerId: z.string() }))
    .query(async (opts) => {
      const { input } = opts;
      return await getPlayersLastTmts(input.playerId);
    }),
  affiliation: {
    request: protectedProcedure
      .input(
        z.object({
          playerId: z.string(),
          userId: z.string(),
          clubId: z.string(),
        }),
      )
      .mutation(async (opts) => {
        const { input } = opts;
        await requestAffiliation(input);
      }),
    accept: clubAdminProcedure
      .input(
        z.object({
          clubId: z.string(),
          affiliationId: z.string(),
          notificationId: z.string(),
        }),
      )
      .mutation(async (opts) => {
        const { input } = opts;
        const { affiliationId, notificationId } = input;
        await acceptAffiliation({ affiliationId, notificationId });
      }),
    reject: clubAdminProcedure
      .input(
        z.object({
          clubId: z.string(),
          affiliationId: z.string(),
          notificationId: z.string(),
        }),
      )
      .mutation(async (opts) => {
        const { input } = opts;
        const { affiliationId, notificationId } = input;
        await rejectAffiliation({ affiliationId, notificationId });
      }),
    abortRequest: protectedProcedure
      .input(
        z.object({
          userId: z.string(),
          affiliationId: z.string(),
          playerId: z.string(),
        }),
      )
      .mutation(async (opts) => {
        const { input } = opts;
        await abortAffiliationRequest(input);
      }),
  },
};
