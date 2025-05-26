'use client';

import Empty from '@/components/empty';
import { UserNotificationLi } from '@/components/notification-items';
import { UserNotification } from '@/server/queries/get-user-notifications';

const UserNotifications = () => {
  // const trpc = useTRPC();
  // const { data: notifications } = useQuery(
  //   trpc.user.authNotifications.queryOptions(),
  // );

  // FIXME mock data
  const notifications = [
    mockApproveNotification,
    mockRejectNotification,
    mockMngrNotification,
    mockTnmtNotification,
  ];

  if (!notifications.length) return <Empty messageId="inbox" />;
  return (
    <div className="mk-container mk-list">
      {notifications.map(NotificationItemIteratee)}
    </div>
  );
};

const NotificationItemIteratee = (data: UserNotification) => {
  return <UserNotificationLi key={data.notification.id} {...data} />;
};
const mockApproveNotification: UserNotification = {
  notification: {
    id: crypto.randomUUID(),
    created_at: new Date(),
    user_id: crypto.randomUUID(),
    notification_type: 'affiliation_approved',
    is_seen: false,
    metadata: {
      club_id: crypto.randomUUID(),
      affiliation_id: crypto.randomUUID(),
    },
  },
  affiliation: {
    id: crypto.randomUUID(),
    created_at: new Date(),
    user_id: crypto.randomUUID(),
    club_id: crypto.randomUUID(),
    player_id: crypto.randomUUID(),
    status: 'requested',
    updated_at: new Date(),
  },
  type: 'affiliation_approved',
  player: {
    id: crypto.randomUUID(),
    nickname: 'PlayerOne',
  },
  club: {
    id: crypto.randomUUID(),
    name: 'Chess Club',
    created_at: new Date(),
    description: '',
    lichess_team: '',
  },
  metadata: {
    club_id: crypto.randomUUID(),
    affiliation_id: crypto.randomUUID(),
  },
};

const mockRejectNotification: UserNotification = {
  notification: {
    id: crypto.randomUUID(),
    created_at: new Date(),
    user_id: crypto.randomUUID(),
    notification_type: 'affiliation_rejected',
    is_seen: false,
    metadata: {
      club_id: crypto.randomUUID(),
      affiliation_id: crypto.randomUUID(),
    },
  },
  affiliation: {
    id: crypto.randomUUID(),
    created_at: new Date(),
    user_id: crypto.randomUUID(),
    club_id: crypto.randomUUID(),
    player_id: crypto.randomUUID(),
    status: 'requested',
    updated_at: new Date(),
  },
  type: 'affiliation_rejected',
  player: {
    id: crypto.randomUUID(),
    nickname: 'PlayerTwo',
  },
  club: {
    id: crypto.randomUUID(),
    name: 'Chess Club',
    created_at: new Date(),
    description: '',
    lichess_team: '',
  },
  metadata: {
    club_id: crypto.randomUUID(),
    affiliation_id: crypto.randomUUID(),
  },
};

const mockTnmtNotification: UserNotification = {
  notification: {
    id: crypto.randomUUID(),
    created_at: new Date(),
    user_id: crypto.randomUUID(),
    notification_type: 'tournament_won',
    is_seen: true,
    metadata: {
      tournament_id: crypto.randomUUID(),
      name: 'tournamentName',
    },
  },
  metadata: {
    name: 'tournamentName',
    tournament_id: crypto.randomUUID(),
  },
  type: 'tournament_won',
};

const mockMngrNotification: UserNotification = {
  notification: {
    id: crypto.randomUUID(),
    created_at: new Date(),
    user_id: crypto.randomUUID(),
    notification_type: 'became_club_manager',
    is_seen: true,
    metadata: {
      club_id: crypto.randomUUID(),
      role: 'co-owner',
    },
  },
  metadata: {
    club_id: crypto.randomUUID(),
    role: 'co-owner',
  },
  type: 'became_club_manager',
  club: {
    id: crypto.randomUUID(),
    name: 'Chess Club',
    created_at: new Date(),
    description: '',
    lichess_team: '',
  },
  role: 'co-owner',
};

export default UserNotifications;
