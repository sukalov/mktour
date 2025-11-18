import { useTRPC } from '@/components/trpc/client';
import { AppRouter } from '@/server/api';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { TRPCClientErrorLike } from '@trpc/client';
import { inferRouterOutputs } from '@trpc/server';

export const useClubNotifications = (
  clubId: string,
): ClubNotificationsResult => {
  const trpc = useTRPC();
  const notificationsDb = useQuery(
    trpc.club.notifications.queryOptions({ clubId }),
  );
  return notificationsDb;
};

type RouterOutputs = inferRouterOutputs<AppRouter>;
type ClubNotificationsResult = UseQueryResult<
  RouterOutputs['club']['notifications'],
  TRPCClientErrorLike<AppRouter>
>;
