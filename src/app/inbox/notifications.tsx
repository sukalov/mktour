'use client';

import Empty from '@/components/empty';
import { useUserNotifications } from '@/components/hooks/query-hooks/use-user-notifications';
import useOnReach from '@/components/hooks/use-on-reach';
import { UserNotificationLi } from '@/components/notification-items';
import SkeletonList from '@/components/skeleton-list';
import { AnyUserNotificationExtended } from '@/server/queries/get-user-notifications';

const UserNotifications = () => {
  const {
    data: notifications,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
  } = useUserNotifications();

  // FIXME mock data
  // const notifications = [
  //   mockApproveNotification,
  //   mockRejectNotification,
  //   mockMngrNotification,
  //   mockTnmtNotification,
  // ];

  const ref = useOnReach(fetchNextPage);

  if (isLoading)
    return (
      <div className="mk-container">
        <SkeletonList />
      </div>
    );
  if (!notifications?.pages[0].notifications.length)
    return <Empty messageId="inbox" />;
  return (
    <div className="mk-container mk-list">
      {notifications.pages.map((page) => {
        if (!page.notifications.length) return null;
        return (
          <div key={page.notifications[0].notification.id}>
            {page.notifications.map(NotificationItemIteratee)}
          </div>
        );
      })}
      {isFetchingNextPage && <SkeletonList />}
      {hasNextPage && <div ref={ref} />}
    </div>
  );
};

const NotificationItemIteratee = (data: AnyUserNotificationExtended) => {
  return <UserNotificationLi key={data.notification.id} {...data} />;
};

// const mockApproveNotification: AnyUserNotificationExtended = {
//   notification: {
//     id: crypto.randomUUID(),
//     createdAt: new Date(),
//     userId: crypto.randomUUID(),
//     event: 'affiliation_approved',
//     isSeen: false,
//     metadata: {
//       clubId: crypto.randomUUID(),
//       affiliationId: crypto.randomUUID(),
//     },
//   },
//   affiliation: {
//     id: crypto.randomUUID(),
//     createdAt: new Date(),
//     userId: crypto.randomUUID(),
//     clubId: crypto.randomUUID(),
//     playerId: crypto.randomUUID(),
//     status: 'requested',
//     updatedAt: new Date(),
//   },
//   event: 'affiliation_approved',
//   player: {
//     id: crypto.randomUUID(),
//     nickname: 'player one',
//   },
//   club: {
//     id: crypto.randomUUID(),
//     name: 'chess club',
//     createdAt: new Date(),
//     description: '',
//     lichessTeam: '',
//   },
//   metadata: {
//     clubId: crypto.randomUUID(),
//     affiliationId: crypto.randomUUID(),
//   },
// };

// const mockRejectNotification: AnyUserNotificationExtended = {
//   notification: {
//     id: crypto.randomUUID(),
//     createdAt: new Date(),
//     userId: crypto.randomUUID(),
//     event: 'affiliation_rejected',
//     isSeen: false,
//     metadata: {
//       clubId: crypto.randomUUID(),
//       affiliationId: crypto.randomUUID(),
//     },
//   },
//   affiliation: {
//     id: crypto.randomUUID(),
//     createdAt: new Date(),
//     userId: crypto.randomUUID(),
//     clubId: crypto.randomUUID(),
//     playerId: crypto.randomUUID(),
//     status: 'requested',
//     updatedAt: new Date(),
//   },
//   event: 'affiliation_rejected',
//   player: {
//     id: crypto.randomUUID(),
//     nickname: 'player two',
//   },
//   club: {
//     id: crypto.randomUUID(),
//     name: 'chess club',
//     createdAt: new Date(),
//     description: '',
//     lichessTeam: '',
//   },
//   metadata: {
//     clubId: crypto.randomUUID(),
//     affiliationId: crypto.randomUUID(),
//   },
// };

// const mockTnmtNotification: AnyUserNotificationExtended = {
//   notification: {
//     id: crypto.randomUUID(),
//     createdAt: new Date(),
//     userId: crypto.randomUUID(),
//     event: 'tournament_won',
//     isSeen: true,
//     metadata: {
//       tournamentId: crypto.randomUUID(),
//       name: 'tournamentName',
//     },
//   },
//   metadata: {
//     name: 'tournamentName',
//     tournamentId: crypto.randomUUID(),
//   },
//   event: 'tournament_won',
//   affiliation: null,
//   player: null,
//   club: null,
// };

// const mockMngrNotification: AnyUserNotificationExtended = {
//   notification: {
//     id: crypto.randomUUID(),
//     createdAt: new Date(),
//     userId: crypto.randomUUID(),
//     event: 'became_club_manager',
//     isSeen: true,
//     metadata: {
//       clubId: crypto.randomUUID(),
//       role: 'co-owner',
//     },
//   },
//   metadata: {
//     clubId: crypto.randomUUID(),
//     role: 'co-owner',
//   },
//   event: 'became_club_manager',
//   club: {
//     id: crypto.randomUUID(),
//     name: 'chess club',
//     createdAt: new Date(),
//     description: '',
//     lichessTeam: '',
//   },
//   affiliation: null,
//   player: null,
// };

export default UserNotifications;
