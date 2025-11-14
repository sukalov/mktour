import { CACHE_TAGS } from '@/lib/cache-tags';
import { protectedProcedure, publicProcedure } from '@/server/api/trpc';
import { db } from '@/server/db';
import { users } from '@/server/db/schema/users';
import selectClub from '@/server/mutations/club-select';
import { deleteUser, editUser } from '@/server/mutations/profile-managing';
import { getUserClubNames } from '@/server/queries/get-user-clubs';
import {
  getUserData,
  getUserInfoByUsername,
} from '@/server/queries/get-user-data';
import { eq } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';
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
      return await getUserInfoByUsername(input.username);
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
      revalidateTag(CACHE_TAGS.AUTH, 'max');
      return resultSet;
    }),
  context: publicProcedure.query(async (opts) => {
    if (!opts.ctx.user) return null;
    return await getUserData(opts.ctx.user.id);
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
      revalidateTag(CACHE_TAGS.AUTH, 'max');
      revalidateTag(CACHE_TAGS.USER_CLUBS, 'max');
    }),
  edit: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        values: z.object({
          name: z.string().optional(),
          username: z.string().optional(),
        }),
      }),
    )
    .mutation(async (opts) => {
      const { input } = opts;
      await editUser(input);
      revalidateTag(CACHE_TAGS.AUTH, 'max');
    }),
};
