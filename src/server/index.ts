import { userRouter } from '@/server/api/routers/user';
import { createTRPCRouter } from '@/server/trpc';

export const appRouter = createTRPCRouter({
  users: userRouter,
});

export type AppRouter = typeof appRouter;
