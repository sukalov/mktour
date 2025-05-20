'use client';

import { AffiliationNotificationLi } from '@/components/notification-items';
import { AffiliationNotification } from '@/server/queries/get-user-notifications';
import { FC } from 'react';

const UserNotifications: FC<{
  groupedNotifications: Record<string, AffiliationNotification[]>;
}> = ({ groupedNotifications }) => {
  return (
    <div className="mk-container">
      {Object.entries(groupedNotifications).map(([club, notifactions]) => (
        <div key={club} className="mk-list">
          <p className="pl-3">{club}:</p>
          {notifactions.map(AffiliationNotificationLi)}
        </div>
      ))}
    </div>
  );
};

export default UserNotifications;
