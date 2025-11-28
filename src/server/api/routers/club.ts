import { validateRequest } from '@/lib/auth/lucia';
import { CACHE_TAGS } from '@/lib/cache-tags';
import meta from '@/server/api/meta';
import {
  clubAdminProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '@/server/api/trpc';
import {
  clubManagersSchema,
  clubsEditSchema,
  clubsInsertSchema,
  clubsSelectSchema,
} from '@/server/db/zod/clubs';
import { clubNotificationExtendedSchema } from '@/server/db/zod/notifications';
import {
  affiliationExtendedSchema,
  playersSelectSchema,
} from '@/server/db/zod/players';
import { tournamentSchema } from '@/server/db/zod/tournaments';
import { usersSelectMinimalSchema } from '@/server/db/zod/users';
import getAllClubManagers, {
  addClubManager,
  createClub,
  deleteClub,
  deleteClubManager,
  editClub,
  getClubAffiliatedUsers,
  leaveClub,
} from '@/server/mutations/club-managing';
import { getClubInfo, getClubPlayers } from '@/server/queries/club';
import getAllClubs from '@/server/queries/get-all-clubs';
import getClubNotifications from '@/server/queries/get-club-notifications';
import { getClubTournaments } from '@/server/queries/get-club-tournaments';
import getStatusInClub from '@/server/queries/get-status-in-club';
import { getUserClubAffiliation } from '@/server/queries/get-user-club-affiliation';
import { revalidateTag } from 'next/cache';
import { z } from 'zod';

export const clubRouter = createTRPCRouter({
  all: publicProcedure
    .meta(meta.clubsAll)
    .output(z.array(clubsSelectSchema))
    .query(async () => {
      return await getAllClubs();
    }),
  create: protectedProcedure
    .meta(meta.clubCreate)
    .input(clubsInsertSchema)
    .output(clubsSelectSchema)
    .mutation(async (opts) => {
      const { input } = opts;
      const newClub = await createClub(opts.ctx.user, input);
      revalidateTag(CACHE_TAGS.AUTH, 'max');
      revalidateTag(CACHE_TAGS.ALL_CLUBS, 'max');
      revalidateTag(`${CACHE_TAGS.USER_CLUBS}:${opts.ctx.user.id}`, 'max');
      return newClub;
    }),
  info: publicProcedure
    .meta(meta.clubInfo)
    .input(z.object({ clubId: z.string() }))
    .output(clubsSelectSchema.nullable())
    .query(async (opts) => {
      return await getClubInfo(opts.input.clubId);
    }),
  players: publicProcedure
    .meta(meta.clubPlayers)
    .input(
      z.object({
        clubId: z.string(),
        cursor: z.number().nullish(),
        limit: z.number().min(1).max(100).optional().default(10),
      }),
    )
    .output(
      z.object({
        players: z.array(playersSelectSchema),
        nextCursor: z.number().nullable(),
      }),
    )
    .query(async (opts) => {
      return await getClubPlayers(
        opts.input.clubId,
        opts.input.limit,
        opts.input.cursor,
      );
    }),
  tournaments: publicProcedure
    .meta(meta.clubTournaments)
    .input(z.object({ clubId: z.string() }))
    .output(z.array(tournamentSchema))
    .query(async (opts) => {
      return await getClubTournaments(opts.input.clubId);
    }),
  affiliatedUsers: publicProcedure
    .meta(meta.clubAffiliatedUsers)
    .input(z.object({ clubId: z.string() }))
    .output(z.array(usersSelectMinimalSchema))
    .query(async (opts) => {
      return await getClubAffiliatedUsers(opts.input.clubId);
    }),
  authAffiliation: protectedProcedure
    .meta(meta.clubAuthAffiliation)
    .input(z.object({ clubId: z.string() }))
    .output(affiliationExtendedSchema.nullable())
    .query(async (opts) => {
      return await getUserClubAffiliation(opts.ctx.user, opts.input.clubId);
    }),
  authStatus: publicProcedure
    .meta(meta.clubAuthStatus)
    .input(z.object({ clubId: z.string() }))
    .output(z.enum(['co-owner', 'admin']).nullable())
    .query(async (opts) => {
      if (!opts.ctx.user || !opts.ctx.clubs) {
        const { user } = await validateRequest();
        if (!user) return null;
        return await getStatusInClub({
          userId: user.id,
          clubId: opts.input.clubId,
        });
      }
      return opts.ctx.clubs && opts.ctx.clubs[opts.input.clubId];
    }),
  managers: createTRPCRouter({
    all: publicProcedure
      .meta(meta.clubManagers)
      .input(z.object({ clubId: z.string() }))
      .output(z.array(clubManagersSchema))
      .query(async (opts) => {
        return await getAllClubManagers(opts.input.clubId);
      }),
    add: clubAdminProcedure
      .meta(meta.clubAddManager)
      .input(
        z.object({
          clubId: z.string(),
          userId: z.string(),
          status: z.enum(['co-owner', 'admin']),
        }),
      )
      .output(z.void())
      .mutation(async (opts) => {
        const { input } = opts;
        await addClubManager({ ...input, user: opts.ctx.user });
        revalidateTag(`${CACHE_TAGS.USER_CLUBS}:${input.userId}`, 'max');
      }),
    delete: clubAdminProcedure
      .meta(meta.clubDeleteManager)
      .input(
        z.object({
          clubId: z.string(),
          userId: z.string(),
        }),
      )
      .output(z.void())
      .mutation(async (opts) => {
        const { input, ctx } = opts;
        await deleteClubManager({ ...input, user: ctx.user });
        revalidateTag(`${CACHE_TAGS.USER_CLUBS}:${input.userId}`, 'max');
      }),
  }),
  notifications: clubAdminProcedure
    .meta(meta.clubNotifications)
    .input(z.object({ clubId: z.string() }))
    .output(z.array(clubNotificationExtendedSchema))
    .query(async (opts) => {
      return await getClubNotifications(opts.input.clubId);
    }),
  delete: clubAdminProcedure
    .meta(meta.clubDelete)
    .input(
      z.object({
        clubId: z.string(),
        userDeletion: z.boolean().default(false),
      }),
    )
    .output(z.void())
    .mutation(async (opts) => {
      const { input, ctx } = opts;
      await deleteClub({ ...input, userId: ctx.user.id });
      revalidateTag(CACHE_TAGS.ALL_CLUBS, 'max');
      revalidateTag(CACHE_TAGS.AUTH, 'max');
      revalidateTag(`${CACHE_TAGS.USER_CLUBS}:${opts.ctx.user.id}`, 'max');
    }),
  edit: clubAdminProcedure
    .meta(meta.clubEdit)
    .input(z.object({ values: clubsEditSchema }))
    .output(clubsSelectSchema)
    .mutation(async (opts) => {
      const { input } = opts;
      const newClub = await editClub({
        ...input,
        username: opts.ctx.user.username,
      });
      if (!newClub) throw new Error('CLUB_NOT_FOUND');
      return newClub;
    }),
  leave: clubAdminProcedure
    .meta(meta.clubLeave)
    .input(
      z.object({
        clubId: z.string(),
      }),
    )
    .output(z.object({ clubs: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      if (Object.keys(ctx.clubs).length === 1)
        throw new Error('CANT_LEAVE_ONLY_CLUB');
      await leaveClub({ clubId: input.clubId, userId: ctx.user.id });

      revalidateTag(CACHE_TAGS.AUTH, 'max');
      revalidateTag(`${CACHE_TAGS.USER_CLUBS}:${ctx.user.id}`, 'max');
      const updatedClubs = Object.keys(ctx.clubs).filter(
        (id) => id !== input.clubId,
      );
      return { clubs: updatedClubs };
    }),
});
