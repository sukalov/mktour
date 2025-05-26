'use client';

import { useTRPC } from '@/components/trpc/client';
import { UserNotification } from '@/server/queries/get-user-notifications';
import { useQuery } from '@tanstack/react-query';
import { FC } from 'react';

const UserNotifications: FC = () => {
  const trpc = useTRPC();
  const { data: notifications } = useQuery(
    trpc.user.authNotifications.queryOptions(),
  );
  if (!notifications) return null;
  return (
    <div className="mk-container">
      {notifications.map(NotificationItemIteratee)}
    </div>
  );
};

const NotificationItemIteratee = (data: UserNotification) => {
  console.log(data.type);
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
    case 'became_club_manager':
      return (
        <div className="py-4" key={data.notification.id}>
          <p>
            congratulations! you were promoted to {data.metadata?.role} in{' '}
            {data.club.name}
          </p>
        </div>
      );
    default:
      return null;
  }
};

export default UserNotifications;
