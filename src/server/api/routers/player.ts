import { publicProcedure } from '@/server/api/trpc';
import getPlayer from '@/server/queries/get-player';
import getPlayersLastTmts from '@/server/queries/get-players-last-tmts';
import { z } from 'zod';

export const playerRouter = {
  playerById: publicProcedure
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
};
