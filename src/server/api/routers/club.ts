import { createClub } from '@/lib/actions/club-managing';
import { protectedProcedure } from '@/server/trpc';
import { z } from 'zod';

export const clubRouter = {
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        created_at: z.date(),
        lichess_team: z.string().optional(),
        set_default: z.boolean(),
      }),
    )
    .meta({
      openapi: {
        method: 'POST',
        path: '/club/create',
      },
    })
    .mutation(async (opts) => {
      const { input } = opts;
      const newClub = createClub(input);
      return newClub;
    }),
};
