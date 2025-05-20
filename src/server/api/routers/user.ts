import { validateRequest } from '@/lib/auth/lucia';
import selectClub from '@/server/actions/club-select';
import getUserClubs from '@/server/actions/user-clubs';
import { db } from '@/server/db';
import { notifications } from '@/server/db/schema/notifications';
import { affiliations, players } from '@/server/db/schema/players';
import { users } from '@/server/db/schema/users';
import { protectedProcedure, publicProcedure } from '@/server/api/trpc';
import { eq, sql } from 'drizzle-orm';
import { z } from 'zod';

export const userRouter = {
  userList: publicProcedure.query(async () => {
    // Retrieve users from a datasource, this is an imaginary database
    const usersDb = await db.select().from(users);
    return usersDb;
  }),
  userById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async (opts) => {
      const { input } = opts;
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, input.id));
      return user;
    }),
  userAuth: publicProcedure.query(async () => {
    const { user } = await validateRequest();
    return user;
  }),
  userCreate: publicProcedure
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
  userClubs: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async (opts) => {
      const { input } = opts;
      const userClubs = await getUserClubs(input);
      return userClubs;
    }),
};
