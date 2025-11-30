import meta from '@/server/api/meta';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { db } from '@/server/db';
import { users } from '@/server/db/schema/users';
import { clubsSelectSchema } from '@/server/db/zod/clubs';
import {
  usersSelectPublicSchema,
  usersSelectSchema,
} from '@/server/db/zod/users';
import { getUserClubNames } from '@/server/queries/get-user-clubs';
import {
  getUserData,
  getUserInfoByUsername,
} from '@/server/queries/get-user-data';
import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

export const userRouter = createTRPCRouter({
  all: publicProcedure
    .meta(meta.usersAll)
    .output(
      z.array(usersSelectSchema.pick({ username: true, name: true, id: true })),
    )
    .query(async () => {
      const usersDb = await db.select().from(users);
      return usersDb;
    }),
  info: publicProcedure
    .meta(meta.usersInfo)
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
    .meta(meta.usersInfoByUsername)
    .output(usersSelectPublicSchema)
    .input(z.object({ username: z.string() }))
    .query(async (opts) => {
      const { input } = opts;
      const user = await getUserInfoByUsername(input.username);
      if (!user) throw new TRPCError({ code: 'NOT_FOUND' });
      return user;
    }),
  context: publicProcedure.query(async (opts) => {
    if (!opts.ctx.user) return null;
    return await getUserData(opts.ctx.user.id);
  }),
  clubs: publicProcedure
    .meta(meta.userClubs)
    .output(z.array(clubsSelectSchema.pick({ id: true, name: true })))
    .input(z.object({ userId: z.string() }))
    .query(async (opts) => {
      const { input } = opts;
      const userClubs = await getUserClubNames(input);
      return userClubs;
    }),
});
