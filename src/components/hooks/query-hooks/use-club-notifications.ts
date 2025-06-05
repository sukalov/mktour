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
type ClubNotificationsResult = UseQueryResult<
  RouterOutputs['club']['notifications'],
  TRPCClientErrorLike<AppRouter>
>;

// @ts-expect-error-mock-data
export const mockClubNotifications: ClubNotificationsResult = {
  data: [
    {
      notification: {
        id: '1',
        created_at: new Date(),
        club_id: 'club1',
        notification_type: 'affiliation_request',
        is_seen: true,
        metadata: null,
      },
      type: 'affiliation_request',
      affiliation: {
        id: 'aff1',
        user_id: 'user1',
        club_id: 'club1',
        player_id: 'player1',
        status: 'requested',
        created_at: new Date(),
        updated_at: new Date(),
      },
      user: {
        id: 'user1',
        name: 'John Doe',
        email: 'johndoe@example.com',
        username: 'johndoe',
        rating: 1200,
        selected_club: 'club1',
        created_at: new Date(),
      },
      player: {
        id: 'player1',
        nickname: 'AcePlayer',
        realname: 'John Doe',
        user_id: 'user1',
        rating: 1500,
        club_id: 'club1',
        last_seen: 0,
      },
    },
    {
      notification: {
        id: '2',
        created_at: new Date(),
        club_id: 'club2',
        notification_type: 'affiliation_request',
        is_seen: false,
        metadata: null,
      },
      type: 'affiliation_request',
      affiliation: {
        id: 'aff2',
        user_id: 'user2',
        club_id: 'club2',
        player_id: 'player2',
        status: 'active',
        created_at: new Date(),
        updated_at: new Date(),
      },
      user: {
        id: 'user2',
        name: 'Jane Smith',
        email: 'janesmith@example.com',
        username: 'janesmith',
        rating: 1300,
        selected_club: 'club2',
        created_at: new Date(),
      },
      player: {
        id: 'player2',
        nickname: 'ProGamer',
        realname: 'Jane Smith',
        user_id: 'user2',
        rating: 1600,
        club_id: 'club2',
        last_seen: 0,
      },
    },
  ],
};
