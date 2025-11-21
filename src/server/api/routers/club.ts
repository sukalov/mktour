import { CACHE_TAGS } from '@/lib/cache-tags';
import meta from '@/server/api/meta';
import {
  clubAdminProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '@/server/api/trpc';
import {
  clubsInsertSchema,
  clubsSelectSchema,
  clubsToUsersSelectSchema,
} from '@/server/db/zod/clubs';
import { clubNotificationExtendedSchema } from '@/server/db/zod/notifications';
import {
  affiliationsSelectSchema,
  playersSelectSchema,
} from '@/server/db/zod/players';
import { tournamentsSelectSchema } from '@/server/db/zod/tournaments';
import { usersSelectSchema } from '@/server/db/zod/users';
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
      const newClub = await createClub(input);
      revalidateTag(CACHE_TAGS.AUTH, 'max');
      revalidateTag(CACHE_TAGS.ALL_CLUBS, 'max');
      revalidateTag(`${CACHE_TAGS.USER_CLUBS}:${opts.ctx.user.id}`, 'max');
      return newClub;
    }),
  info: publicProcedure
    .meta(meta.clubInfo)
    .input(z.object({ clubId: z.string() }))
    .output(clubsSelectSchema.optional())
    .query(async (opts) => {
      return await getClubInfo(opts.input.clubId);
    }),
  players: createTRPCRouter({
    infinite: publicProcedure
      .meta(meta.clubPlayers)
      .input(
        z.object({
          clubId: z.string(),
          cursor: z.number().nullish(),
          limit: z.number().min(1).max(100).optional().default(20),
        }),
      )
      .output(
        z.object({
          players: z.array(playersSelectSchema),
          nextCursor: z.number().nullable(),
        }),
      )
      .query(async (opts) => {
        const cursor = opts.input.cursor;
        return await getClubPlayers(
          opts.input.clubId,
          opts.input.limit,
          cursor,
        );
      }),
  }),
  tournaments: publicProcedure
    .meta(meta.clubTournaments)
    .input(z.object({ clubId: z.string() }))
    .output(z.array(tournamentsSelectSchema))
    .query(async (opts) => {
      return await getClubTournaments(opts.input.clubId);
    }),
  affiliatedUsers: publicProcedure
    .meta(meta.clubAffiliatedUsers)
    .input(z.object({ clubId: z.string() }))
    .output(z.array(usersSelectSchema))
    .query(async (opts) => {
      return await getClubAffiliatedUsers(opts.input.clubId);
    }),
  authAffiliation: protectedProcedure
    .meta(meta.clubAuthAffiliation)
    .input(z.object({ clubId: z.string() }))
    .output(z.array(affiliationsSelectSchema))
    .query(async (opts) => {
      return await getUserClubAffiliation(opts.ctx.user, opts.input.clubId);
    }),
  authStatus: publicProcedure
    .meta(meta.clubAuthStatus)
    .input(z.object({ clubId: z.string(), userId: z.string() }))
    .output(z.enum(['co-owner', 'admin']).optional())
    .query(async (opts) => {
      return await getStatusInClub({
        userId: opts.input.userId,
        clubId: opts.input.clubId,
      });
    }),
  managers: createTRPCRouter({
    all: publicProcedure
      .meta(meta.clubManagers)
      .input(z.object({ clubId: z.string() }))
      .output(
        z.array(
          z.object({
            clubs_to_users: clubsToUsersSelectSchema,
            user: usersSelectSchema,
          }),
        ),
      )
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
        await addClubManager(input);
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
        const { input } = opts;
        await deleteClubManager(input);
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
    .input(
      z.object({
        clubId: z.string(),
        userId: z.string(),
        values: z.object({
          name: z.string().optional(),
          description: z.string().optional().nullable(),
          lichessTeam: z.string().optional().nullable(),
        }),
      }),
    )
    .output(z.void())
    .mutation(async (opts) => {
      const { input } = opts;
      await editClub(input);
      revalidateTag(CACHE_TAGS.ALL_CLUBS, 'max');
    }),
  leave: clubAdminProcedure
    .meta(meta.clubLeave)
    .input(
      z.object({
        clubId: z.string(),
      }),
    )
    .output(z.object({ clubs: z.array(z.string()) }))
    .mutation(async (opts) => {
      if (Object.keys(opts.ctx.clubs).length === 1)
        throw new Error('CANT_LEAVE_ONLY_CLUB');
      await leaveClub(opts.input.clubId);
      revalidateTag(CACHE_TAGS.AUTH, 'max');
      revalidateTag(`${CACHE_TAGS.USER_CLUBS}:${opts.ctx.user.id}`, 'max');
      const updatedClubs = Object.keys(opts.ctx.clubs).filter(
        (id) => id !== opts.input.clubId,
      );
      return { clubs: updatedClubs };
    }),
});
