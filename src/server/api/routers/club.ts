import { protectedProcedure, publicProcedure } from '@/server/api/trpc';
import {
  createClub,
  getClubAffiliatedUsers,
  getClubInfo,
  getClubPlayers,
} from '@/server/mutations/club-managing';
import { getClubTournaments } from '@/server/queries/get-club-tournaments';
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
  players: publicProcedure
    .input(z.object({ clubId: z.string() }))
    .query(async (opts) => {
      return await getClubPlayers(opts.input.clubId);
    }),
  tournaments: publicProcedure
    .input(z.object({ clubId: z.string() }))
    .query(async (opts) => {
      return await getClubTournaments(opts.input.clubId);
    }),
  affiliatedUsers: publicProcedure
    .input(z.object({ clubId: z.string() }))
    .query(async (opts) => {
      return await getClubAffiliatedUsers(opts.input.clubId);
    }),
};
