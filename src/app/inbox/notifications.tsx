'use client';

import Empty from '@/components/empty';
import { UserNotificationLi } from '@/components/notification-items';
import { AnyUserNotificationExtended } from '@/server/queries/get-user-notifications';

const UserNotifications = () => {
  // const { data: notifications, fetchNextPage, hasNextPage } = useUserNotifications();

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

const NotificationItemIteratee = (data: AnyUserNotificationExtended) => {
  return <UserNotificationLi key={data.notification.id} {...data} />;
};
const mockApproveNotification: AnyUserNotificationExtended = {
  notification: {
    id: crypto.randomUUID(),
    created_at: new Date(),
    user_id: crypto.randomUUID(),
    event: 'affiliation_approved',
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
  event: 'affiliation_approved',
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

const mockRejectNotification: AnyUserNotificationExtended = {
  notification: {
    id: crypto.randomUUID(),
    created_at: new Date(),
    user_id: crypto.randomUUID(),
    event: 'affiliation_rejected',
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
  event: 'affiliation_rejected',
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

const mockTnmtNotification: AnyUserNotificationExtended = {
  notification: {
    id: crypto.randomUUID(),
    created_at: new Date(),
    user_id: crypto.randomUUID(),
    event: 'tournament_won',
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
  event: 'tournament_won',
  affiliation: null,
  player: null,
  club: null,
};

const mockMngrNotification: AnyUserNotificationExtended = {
  notification: {
    id: crypto.randomUUID(),
    created_at: new Date(),
    user_id: crypto.randomUUID(),
    event: 'became_club_manager',
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
  event: 'became_club_manager',
  club: {
    id: crypto.randomUUID(),
    name: 'Chess Club',
    created_at: new Date(),
    description: '',
    lichess_team: '',
  },
  affiliation: null,
  player: null,
};

export default UserNotifications;
