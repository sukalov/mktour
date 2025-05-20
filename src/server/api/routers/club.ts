import {
  createClub,
  getClubInfo,
  getClubPlayers,
} from '@/server/actions/club-managing';
import { getClubTournaments } from '@/server/actions/get-club-tournaments';
import { protectedProcedure, publicProcedure } from '@/server/api/trpc';
import { z } from 'zod';

export const clubRouter = {
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        created_at: z.date(),
        lichess_team: z.string().optional(),
        set_default: z.boolean(),
      }),
    )
    .mutation(async (opts) => {
      const { input } = opts;
      const newClub = createClub(input);
      return newClub;
    }),
  clubById: publicProcedure
    .input(z.object({ clubId: z.string() }))
    .query(async (opts) => {
      return await getClubInfo(opts.input.clubId);
    }),
  clubPlayers: publicProcedure
    .input(z.object({ clubId: z.string() }))
    .query(async (opts) => {
      return await getClubPlayers(opts.input.clubId);
    }),
  clubTournaments: publicProcedure
    .input(z.object({ clubId: z.string() }))
    .query(async (opts) => {
      return await getClubTournaments(opts.input.clubId);
    }),
};
