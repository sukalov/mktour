import selectClub from '@/lib/actions/club-select';
import { validateRequest } from '@/lib/auth/lucia';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema/users';
import { protectedProcedure, publicProcedure } from '@/server/trpc';
import { eq } from 'drizzle-orm';
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
      console.log('RESULTSET', resultSet);
      return resultSet;
    }),
};
