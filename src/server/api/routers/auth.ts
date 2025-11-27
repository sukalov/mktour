import { validateRequest } from '@/lib/auth/lucia';
import { CACHE_TAGS } from '@/lib/cache-tags';
import { getEncryptedAuthSession } from '@/lib/get-encrypted-auth-session';
import { newid, timeout } from '@/lib/utils';
import meta from '@/server/api/meta';
import { protectedProcedure, publicProcedure } from '@/server/api/trpc';
import { apiTokens } from '@/server/db/schema/users';
import { clubsSelectSchema } from '@/server/db/zod/clubs';
import {
  apiToken,
  editProfileFormSchema,
  usersSelectSchema,
} from '@/server/db/zod/users';
import selectClub from '@/server/mutations/club-select';
import { logout } from '@/server/mutations/logout';
import {
  changeNotificationStatus,
  markAllNotificationsAsSeen,
} from '@/server/mutations/notifications';
import { deleteUser, editUser } from '@/server/mutations/profile-managing';
import { getUserClubs } from '@/server/queries/get-user-clubs';
import {
  AnyUserNotificationExtended,
  getAuthNotificationsInfinite,
  getNotificationsCounter,
} from '@/server/queries/get-user-notifications';
import { TRPCError } from '@trpc/server';
import crypto from 'crypto';
import { eq } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';
import z from 'zod';

export const authRouter = {
  info: publicProcedure
    .meta(meta.authInfo)
    .output(usersSelectSchema.nullish())
    .query(async ({ ctx }) => {
      let { user } = ctx;
      if (!user) {
        const result = await validateRequest();
        user = result.user ?? null;
      }
      return user || null;
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
      .query(async ({ input, ctx }) => {
        return (await getAuthNotificationsInfinite({
          limit: input.limit,
          offset: input.cursor ?? 0,
          userId: ctx.user.id,
        })) as {
          notifications: AnyUserNotificationExtended[];
          nextCursor: number | null;
        }; // FIXME as
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
  clubs: protectedProcedure
    .meta(meta.authClubs)
    .output(z.array(clubsSelectSchema))
    .query(async ({ ctx }) => {
      return await getUserClubs({ userId: ctx.user.id });
    }),
  selectClub: protectedProcedure
    .meta(meta.authSelectClub)
    .output(z.string())
    .input(z.object({ clubId: z.string() }))
    .mutation(async (opts) => {
      const { input } = opts;
      const { selectedClub } = await selectClub(input);
      await timeout(1000);
      revalidateTag(CACHE_TAGS.AUTH, 'max');
      return selectedClub;
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
    .meta(meta.authEdit)
    .input(editProfileFormSchema)
    .output(z.void())
    .mutation(async ({ ctx, input }) => {
      await editUser(ctx.user.id, input);
      revalidateTag(CACHE_TAGS.AUTH, 'max');
    }),
  apiToken: {
    list: protectedProcedure
      .output(z.array(apiToken))
      .query(async ({ ctx }) => {
        const tokens = await ctx.db.query.apiTokens.findMany({
          where: eq(apiTokens.userId, ctx.user.id),
          orderBy: (tokens, { desc }) => [desc(tokens.createdAt)],
        });
        return tokens;
      }),

    generate: protectedProcedure
      .input(z.object({ name: z.string().min(1) }))
      .mutation(async ({ ctx, input }) => {
        const id = newid();
        const secret = newid(32);
        const token = `mktour_${id}_${secret}`;
        const tokenHash = crypto
          .createHash('sha256')
          .update(secret)
          .digest('hex');

        await ctx.db.insert(apiTokens).values({
          id,
          tokenHash,
          userId: ctx.user.id,
          name: input.name,
          createdAt: new Date(),
        });

        return { token };
      }),

    revoke: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const token = await ctx.db.query.apiTokens.findFirst({
          where: eq(apiTokens.id, input.id),
        });

        if (!token) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Token not found',
          });
        }

        if (token.userId !== ctx.user.id) {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Not your token' });
        }

        await ctx.db.delete(apiTokens).where(eq(apiTokens.id, input.id));
      }),
  },
};
