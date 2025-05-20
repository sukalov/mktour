import { validateRequest } from '@/lib/auth/lucia';
import { protectedProcedure, publicProcedure } from '@/server/api/trpc';
import { db } from '@/server/db';
import { notifications } from '@/server/db/schema/notifications';
import { affiliations, players } from '@/server/db/schema/players';
import { users } from '@/server/db/schema/users';
import selectClub from '@/server/mutations/club-select';
import { deleteUser } from '@/server/mutations/profile-managing';
import {
  getUserClubNames,
  getUserClubs,
} from '@/server/queries/get-user-clubs';
import getUserData from '@/server/queries/get-user-data';
import { eq, sql } from 'drizzle-orm';
import { z } from 'zod';

export const userRouter = {
  all: publicProcedure.query(async () => {
    const usersDb = await db.select().from(users);
    return usersDb;
  }),
  info: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async (opts) => {
      const { input } = opts;
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, input.id));
      return user;
    }),
  infoByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async (opts) => {
      const { input } = opts;
      return await getUserData(input.username);
    }),
  auth: publicProcedure.query(async () => {
    const { user } = await validateRequest();
    return user;
  }),
  create: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        email: z.string(),
        username: z.string(),
        rating: z.number().optional(),
        selected_club: z.string(),
        created_at: z.date(),
      }),
    )
    .mutation(async (opts) => {
      const { input } = opts;
      const user = await db.insert(users).values(input);
      return user;
    }),
  selectClub: protectedProcedure
    .input(
      z.object({
        clubId: z.string(),
        userId: z.string(),
      }),
    )
    .mutation(async (opts) => {
      const { input } = opts;
      const resultSet = await selectClub(input);
      return resultSet;
    }),
  notifications: publicProcedure.query(async () => {
    const { user } = await validateRequest();
    if (!user) {
      return [];
    }
    const userNotifications = await db
      .select()
      .from(notifications)
      .where(eq(notifications.user_id, user.id))
      .leftJoin(
        affiliations,
        sql`json_extract(${notifications.metadata}, '$.affiliation_id') = ${affiliations.id}`,
      )
      .leftJoin(users, eq(users.id, affiliations.user_id))
      .leftJoin(players, eq(players.id, affiliations.player_id));

    return userNotifications;
  }),
  clubs: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async (opts) => {
      const { input } = opts;
      const userClubs = await getUserClubNames(input);
      return userClubs;
    }),
  delete: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .mutation(async (opts) => {
      const { input } = opts;
      await deleteUser(input);
    }),
  authClubs: protectedProcedure.query(async (opts) => {
    return await getUserClubs({ userId: opts.ctx.user.id });
  }),
};
