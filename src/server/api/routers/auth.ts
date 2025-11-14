import { validateRequest } from '@/lib/auth/lucia';
import { CACHE_TAGS } from '@/lib/cache-tags';
import { getEncryptedAuthSession } from '@/lib/get-encrypted-auth-session';
import { protectedProcedure, publicProcedure } from '@/server/api/trpc';
import { logout } from '@/server/mutations/logout';
import {
  changeNotificationStatus,
  markAllNotificationsAsSeen,
} from '@/server/mutations/notifications';
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
};
