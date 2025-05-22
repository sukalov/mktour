'use client';

import Empty from '@/components/empty';
import { UserNotification } from '@/server/queries/get-user-notifications';
import { FC, use } from 'react';

const UserNotifications: FC<{
  notificationsPromise: Promise<UserNotification[]>;
}> = ({ notificationsPromise }) => {
  const notifications = use(notificationsPromise);

  if (!notifications.length) return <Empty messageId="inbox" />;
  return (
    <div className="mk-container">
      {notifications.map(NotificationItemIteratee)}
    </div>
  );
};

const NotificationItemIteratee = (data: UserNotification) => {
  switch (data.type) {
    case 'affiliation_approved':
      return (
        <div className="py-4" key={data.notification.id}>
          <p>
            approved affiliation with {data.player.nickname} in {data.club.name}
          </p>
        </div>
      );
    case 'affiliation_rejected':
      return (
        <div className="py-4" key={data.notification.id}>
          <p>
            rejected affiliation request with {data.player.nickname} in{' '}
            {data.club.name}
          </p>
        </div>
      );
    default:
      return null;
  }
};

export default UserNotifications;
