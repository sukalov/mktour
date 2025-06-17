import { validateRequest } from '@/lib/auth/lucia';
import { CACHE_TAGS } from '@/lib/cache-tags';
import { getEncryptedAuthSession } from '@/lib/get-encrypted-auth-session';
import { protectedProcedure, publicProcedure } from '@/server/api/trpc';
import { db } from '@/server/db';
import { users } from '@/server/db/schema/users';
import selectClub from '@/server/mutations/club-select';
import { deleteUser, editUser } from '@/server/mutations/profile-managing';
import {
  getUserClubNames,
  getUserClubs,
} from '@/server/queries/get-user-clubs';
import {
  getUserData,
  getUserInfoByUsername,
} from '@/server/queries/get-user-data';
import getUserNotifications from '@/server/queries/get-user-notifications';
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
  auth: publicProcedure.query(async () => {
    const { user } = await validateRequest();
    return user;
  }),
  encryptedSession: publicProcedure.query(async () => {
    return await getEncryptedAuthSession();
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
      revalidateTag(CACHE_TAGS.AUTH);
      return resultSet;
    }),
  authNotifications: publicProcedure.query(async () => {
    const { user } = await validateRequest();
    if (!user) {
      return [];
    }
    const userNotifications = await getUserNotifications();
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
    }),
  authClubs: protectedProcedure.query(async () => {
    const { user } = await validateRequest();
    if (!user) return [];
    return await getUserClubs({ userId: user.id });
  }),
  authContext: publicProcedure.query(async (opts) => {
    if (!opts.ctx.user) return null;
    return await getUserData(opts.ctx.user.id);
  }),
};
