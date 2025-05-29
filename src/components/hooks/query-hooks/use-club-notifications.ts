import { mockClubNotifications } from '@/app/clubs/my/(tabs)/inbox';
import { useTRPC } from '@/components/trpc/client';
import { AppRouter } from '@/server/api';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { TRPCClientErrorLike } from '@trpc/client';
import { inferRouterOutputs } from '@trpc/server';

const MOCK = true;

export const useClubNotifications = (
  clubId: string,
): ClubNotificationsResult => {
  const trpc = useTRPC();
  const notificationsDb = useQuery(
    trpc.club.notifications.queryOptions({ clubId }),
  );

  return MOCK ? mockClubNotifications : notificationsDb;
};

type RouterOutputs = inferRouterOutputs<AppRouter>;
export type ClubNotificationsResult = UseQueryResult<
  RouterOutputs['club']['notifications'],
  TRPCClientErrorLike<AppRouter>
>;
