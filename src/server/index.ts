import { clubRouter } from '@/server/api/routers/club';
import { tournamentRouter } from '@/server/api/routers/tournament';
import { userRouter } from '@/server/api/routers/user';
import { createTRPCRouter } from '@/server/trpc';

export const appRouter = createTRPCRouter({
  user: userRouter,
  tournament: tournamentRouter,
  club: clubRouter,
});

export type AppRouter = typeof appRouter;
