import { validateRequest } from '@/lib/auth/lucia';
import {
  clubAdminProcedure,
  protectedProcedure,
  publicProcedure,
} from '@/server/api/trpc';
import getAllClubManagers, {
  addClubManager,
  createClub,
  deleteClub,
  editClub,
  getClubAffiliatedUsers,
  getClubInfo,
  getClubPlayers,
  leaveClub,
} from '@/server/mutations/club-managing';
import getAllClubs from '@/server/queries/get-all-clubs';
import getClubNotifications from '@/server/queries/get-club-notifications';
import { getClubTournaments } from '@/server/queries/get-club-tournaments';
import getStatusInClub from '@/server/queries/get-status-in-club';
import { getUserClubAffiliation } from '@/server/queries/get-user-club-affiliation';
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
  info: publicProcedure
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
  authAffiliation: protectedProcedure
    .input(z.object({ clubId: z.string() }))
    .query(async (opts) => {
      return await getUserClubAffiliation(opts.ctx.user, opts.input.clubId);
    }),
  authStatus: publicProcedure
    .input(z.object({ clubId: z.string() }))
    .query(async (opts) => {
      const { user } = await validateRequest();
      if (!user) return undefined;
      return await getStatusInClub({
        userId: user.id,
        clubId: opts.input.clubId,
      });
    }),
  all: publicProcedure.query(async () => {
    return await getAllClubs();
  }),
  managers: {
    all: publicProcedure
      .input(z.object({ clubId: z.string() }))
      .query(async (opts) => {
        return await getAllClubManagers(opts.input.clubId);
      }),
    add: clubAdminProcedure
      .input(
        z.object({
          clubId: z.string(),
          userId: z.string(),
          status: z.enum(['co-owner', 'admin']),
        }),
      )
      .mutation(async (opts) => {
        const { input } = opts;
        await addClubManager(input);
      }),
  },
  notifications: clubAdminProcedure
    .input(z.object({ clubId: z.string() }))
    .query(async (opts) => {
      return await getClubNotifications(opts.input.clubId);
    }),
  delete: clubAdminProcedure
    .input(
      z.object({
        clubId: z.string(),
        userId: z.string(),
        userDeletion: z.boolean(),
      }),
    )
    .mutation(async (opts) => {
      const { input } = opts;
      await deleteClub(input);
    }),
  edit: clubAdminProcedure
    .input(
      z.object({
        clubId: z.string(),
        userId: z.string(),
        values: z.object({
          name: z.string().optional(),
          description: z.string().optional().nullable(),
          lichess_team: z.string().optional().nullable(),
        }),
      }),
    )
    .mutation(async (opts) => {
      const { input } = opts;
      await editClub(input);
    }),
  leave: clubAdminProcedure
    .input(
      z.object({
        clubId: z.string(),
      }),
    )
    .mutation(async (opts) => {
      if (opts.ctx.clubs.length === 1) throw new Error('CANT_LEAVE_ONLY_CLUB');
      await leaveClub(opts.input.clubId);
      const updatedClubs = opts.ctx.clubs.filter(
        (id) => id !== opts.input.clubId,
      );
      return { clubs: updatedClubs };
    }),
};
