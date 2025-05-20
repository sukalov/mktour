import { validateRequest } from '@/lib/auth/lucia';
import { getUserClubIds } from '@/server/actions/user-clubs';
import { clubRouter } from '@/server/api/routers/club';
import { playerRouter } from '@/server/api/routers/player';
import { tournamentRouter } from '@/server/api/routers/tournament';
import { userRouter } from '@/server/api/routers/user';
import { db } from '@/server/db';
import { createTRPCRouter } from '@/server/trpc';

export const appRouter = createTRPCRouter({
  user: userRouter,
  tournament: tournamentRouter,
  club: clubRouter,
  player: playerRouter,
});

export const publicCaller = appRouter.createCaller({
  session: null,
  user: null,
  clubs: [],
  db,
  headers: new Headers(),
});

export const makeProtectedCaller = async () => {
  const { session, user } = await validateRequest();
  const clubs = user ? await getUserClubIds({ userId: user.id }) : [];
  return appRouter.createCaller({
    session,
    user,
    clubs,
    db,
    headers: new Headers(),
  });
};

export type AppRouter = typeof appRouter;
