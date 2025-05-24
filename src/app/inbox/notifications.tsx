'use client';

import Empty from '@/components/empty';
import { UserNotificationLi } from '@/components/notification-items';
import { UserNotification } from '@/server/queries/get-user-notifications';
import { FC } from 'react';

const UserNotifications: FC<{
  notificationsPromise: Promise<UserNotification[]>;
}> = ({}) => {
  // const notifications = use(notificationsPromise);

  // FIXME mock data
  const notifications = [
    mockApproveNotification,
    mockRejectNotification,
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
  return <UserNotificationLi {...data} />;
};

const mockApproveNotification: UserNotification = {
  notification: {
    id: '1',
    created_at: new Date(),
    user_id: 'user1',
    notification_type: 'affiliation_approved',
    is_seen: false,
    metadata: {
      club_id: 'club1',
      affiliation_id: 'affiliation1',
    },
  },
  affiliation: {
    id: '',
    created_at: new Date(),
    user_id: '',
    club_id: '',
    player_id: '',
    status: 'requested',
    updated_at: new Date(),
  },
  type: 'affiliation_approved',
  player: {
    id: 'player1',
    nickname: 'PlayerOne',
  },
  club: {
    id: 'club1',
    name: 'Chess Club',
    created_at: new Date(),
    description: '',
    lichess_team: '',
  },
};

const mockRejectNotification: UserNotification = {
  notification: {
    id: '1',
    created_at: new Date(),
    user_id: 'user1',
    notification_type: 'affiliation_rejected',
    is_seen: false,
    metadata: {
      club_id: 'club1',
      affiliation_id: 'affiliation1',
    },
  },
  affiliation: {
    id: '',
    created_at: new Date(),
    user_id: '',
    club_id: '',
    player_id: '',
    status: 'requested',
    updated_at: new Date(),
  },
  type: 'affiliation_rejected',
  player: {
    id: 'player1',
    nickname: 'PlayerTwo',
  },
  club: {
    id: 'club1',
    name: 'Chess Club',
    created_at: new Date(),
    description: '',
    lichess_team: '',
  },
};

const mockTnmtNotification: UserNotification = {
  notification: {
    id: '1',
    created_at: new Date(),
    user_id: 'user1',
    notification_type: 'tournament_won',
    is_seen: false,
    metadata: {
      tournament_id: 'tournament1',
      name: 'tournamentName',
    },
  },
  type: 'tournament_won',
};

export default UserNotifications;
