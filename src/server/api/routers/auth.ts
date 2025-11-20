import { validateRequest } from '@/lib/auth/lucia';
import { CACHE_TAGS } from '@/lib/cache-tags';
import { getEncryptedAuthSession } from '@/lib/get-encrypted-auth-session';
import { timeout } from '@/lib/utils';
import meta from '@/server/api/meta';
import { protectedProcedure, publicProcedure } from '@/server/api/trpc';
import { editProfileFormSchema } from '@/server/db/zod/users';
import selectClub from '@/server/mutations/club-select';
import { logout } from '@/server/mutations/logout';
import {
  changeNotificationStatus,
  markAllNotificationsAsSeen,
} from '@/server/mutations/notifications';
import { deleteUser, editUser } from '@/server/mutations/profile-managing';
import { getUserClubs } from '@/server/queries/get-user-clubs';
import {
  getNotificationsCounter,
  getUserNotificationsInfinite,
} from '@/server/queries/get-user-notifications';
import { revalidateTag } from 'next/cache';
import z from 'zod';

export const authRouter = {
  info: publicProcedure.query(async () => {
    const { user } = await validateRequest();
    return user;
  }),
  encryptedSession: publicProcedure.query(async () => {
    return await getEncryptedAuthSession();
  }),
  signOut: publicProcedure.mutation(async () => {
    await logout();
    revalidateTag(CACHE_TAGS.AUTH, 'max');
  }),
  notifications: {
    infinite: protectedProcedure
      .input(
        z.object({
          limit: z.number().min(1).max(100).optional().default(20),
          cursor: z.number().nullish(),
        }),
      )
      .query(async ({ input }) => {
        return await getUserNotificationsInfinite({
          limit: input.limit,
          offset: input.cursor ?? 0,
        });
      }),
    counter: publicProcedure.query(async () => {
      const { user } = await validateRequest();
      if (!user) return 0;
      return await getNotificationsCounter(user.id);
    }),
    changeStatus: protectedProcedure
      .input(z.object({ notificationId: z.string(), seen: z.boolean() }))
      .mutation(async ({ input }) => {
        await changeNotificationStatus(input);
      }),
    markAllAsSeen: protectedProcedure.mutation(async (opts) => {
      await markAllNotificationsAsSeen(opts.ctx.user.id);
    }),
  },
  clubs: protectedProcedure.query(async () => {
    const { user } = await validateRequest();
    if (!user) return [];
    return await getUserClubs({ userId: user.id });
  }),
  selectClub: protectedProcedure
    .output(z.string())
    .input(z.object({ clubId: z.string() }))
    .mutation(async (opts) => {
      const { input } = opts;
      const { selected_club } = await selectClub(input);
      console.log(input);
      await timeout(1000);
      revalidateTag(CACHE_TAGS.AUTH, 'max');
      return selected_club;
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
    .meta(meta.usersEdit)
    .input(editProfileFormSchema)
    .output(z.void())
    .mutation(async (opts) => {
      const { input } = opts;
      await editUser(input);
      revalidateTag(CACHE_TAGS.AUTH, 'max');
    }),
};
