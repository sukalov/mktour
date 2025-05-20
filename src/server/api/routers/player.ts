import { publicProcedure } from '@/server/api/trpc';
import getPlayersLastTmts from '@/server/queries/get-players-last-tmts';
import { z } from 'zod';

export const playerRouter = {
  playersLastTournaments: publicProcedure
    .input(z.object({ playerId: z.string() }))
    .query(async (opts) => {
      const { input } = opts;
      const result = await getPlayersLastTmts(input.playerId);
      return result;
    }),
};
