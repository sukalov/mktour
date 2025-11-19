import { CACHE_TAGS } from '@/lib/cache-tags';
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '@/server/api/trpc';
import { db } from '@/server/db';
import { users, usersSelectSchema } from '@/server/db/schema/users';
import { clubsSelectSchema } from '@/server/db/zod/clubs';
import { deleteUser, editUser } from '@/server/mutations/profile-managing';
import { getUserClubNames } from '@/server/queries/get-user-clubs';
import {
  getUserData,
  getUserInfoByUsername,
} from '@/server/queries/get-user-data';
import { eq } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';
import { z } from 'zod';

export const userRouter = createTRPCRouter({
  all: publicProcedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/users',
        summary: 'get all users',
        tags: ['users'],
      },
    })
    .output(
      z.array(usersSelectSchema.pick({ username: true, name: true, id: true })),
    )
    .query(async () => {
      const usersDb = await db.select().from(users);
      return usersDb;
    }),
  info: publicProcedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/users/{userId}',
        summary: 'get user by id',
        tags: ['users'],
      },
    })
    .input(z.object({ userId: z.string() }))
    .output(
      usersSelectSchema
        .pick({ username: true, name: true, rating: true })
        .optional(),
    )
    .query(async (opts) => {
      const { input } = opts;
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, input.userId));
      return user;
    }),
  infoByUsername: publicProcedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/users/username/{username}',
        summary: 'get user by username',
        tags: ['users'],
      },
    })
    .output(
      usersSelectSchema
        .pick({
          id: true,
          username: true,
          name: true,
          rating: true,
          created_at: true,
        })
        .optional(),
    )
    .input(z.object({ username: z.string() }))
    .query(async (opts) => {
      const { input } = opts;
      return await getUserInfoByUsername(input.username);
    }),
  context: publicProcedure.query(async (opts) => {
    if (!opts.ctx.user) return null;
    return await getUserData(opts.ctx.user.id);
  }),
  clubs: publicProcedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/users/{userId}/clubs',
        summary: 'get clubs where user is admin',
        tags: ['users'],
      },
    })
    .output(z.array(clubsSelectSchema.pick({ id: true, name: true })))
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
});
