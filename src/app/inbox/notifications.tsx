'use client';

import Empty from '@/components/empty';
import { useUserNotifications } from '@/components/hooks/query-hooks/use-user-notifications';
import { UserNotificationLi } from '@/components/notification-items';
import { AnyUserNotificationExtended } from '@/server/queries/get-user-notifications';

const UserNotifications = () => {
  const {
    data: notificationss,
    fetchNextPage,
    hasNextPage,
  } = useUserNotifications();

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
    createdAt: new Date(),
    userId: crypto.randomUUID(),
    event: 'affiliation_approved',
    isSeen: false,
    metadata: {
      clubId: crypto.randomUUID(),
      affiliationId: crypto.randomUUID(),
    },
  },
  affiliation: {
    id: crypto.randomUUID(),
    createdAt: new Date(),
    userId: crypto.randomUUID(),
    clubId: crypto.randomUUID(),
    playerId: crypto.randomUUID(),
    status: 'requested',
    updatedAt: new Date(),
  },
  event: 'affiliation_approved',
  player: {
    id: crypto.randomUUID(),
    nickname: 'player one',
  },
  club: {
    id: crypto.randomUUID(),
    name: 'chess club',
    createdAt: new Date(),
    description: '',
    lichessTeam: '',
  },
  metadata: {
    clubId: crypto.randomUUID(),
    affiliationId: crypto.randomUUID(),
  },
};

const mockRejectNotification: AnyUserNotificationExtended = {
  notification: {
    id: crypto.randomUUID(),
    createdAt: new Date(),
    userId: crypto.randomUUID(),
    event: 'affiliation_rejected',
    isSeen: false,
    metadata: {
      clubId: crypto.randomUUID(),
      affiliationId: crypto.randomUUID(),
    },
  },
  affiliation: {
    id: crypto.randomUUID(),
    createdAt: new Date(),
    userId: crypto.randomUUID(),
    clubId: crypto.randomUUID(),
    playerId: crypto.randomUUID(),
    status: 'requested',
    updatedAt: new Date(),
  },
  event: 'affiliation_rejected',
  player: {
    id: crypto.randomUUID(),
    nickname: 'player two',
  },
  club: {
    id: crypto.randomUUID(),
    name: 'chess club',
    createdAt: new Date(),
    description: '',
    lichessTeam: '',
  },
  metadata: {
    clubId: crypto.randomUUID(),
    affiliationId: crypto.randomUUID(),
  },
};

const mockTnmtNotification: AnyUserNotificationExtended = {
  notification: {
    id: crypto.randomUUID(),
    createdAt: new Date(),
    userId: crypto.randomUUID(),
    event: 'tournament_won',
    isSeen: true,
    metadata: {
      tournamentId: crypto.randomUUID(),
      name: 'tournamentName',
    },
  },
  metadata: {
    name: 'tournamentName',
    tournamentId: crypto.randomUUID(),
  },
  event: 'tournament_won',
  affiliation: null,
  player: null,
  club: null,
};

const mockMngrNotification: AnyUserNotificationExtended = {
  notification: {
    id: crypto.randomUUID(),
    createdAt: new Date(),
    userId: crypto.randomUUID(),
    event: 'became_club_manager',
    isSeen: true,
    metadata: {
      clubId: crypto.randomUUID(),
      role: 'co-owner',
    },
  },
  metadata: {
    clubId: crypto.randomUUID(),
    role: 'co-owner',
  },
  event: 'became_club_manager',
  club: {
    id: crypto.randomUUID(),
    name: 'chess club',
    createdAt: new Date(),
    description: '',
    lichessTeam: '',
  },
  affiliation: null,
  player: null,
};

export default UserNotifications;
