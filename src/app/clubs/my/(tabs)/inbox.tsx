'use client';

import Empty from '@/components/empty';
import { useClubNotifications } from '@/components/hooks/query-hooks/use-club-notifications';
import {
  AffiliationNotificationLi,
  NotificationItem,
} from '@/components/notification-items';
import SkeletonList from '@/components/skeleton-list';
import { ClubNotification } from '@/server/queries/get-club-notifications';
import { useTranslations } from 'next-intl';
import { FC } from 'react';

const ClubInbox: FC<{ selectedClub: string }> = ({ selectedClub }) => {
  const t = useTranslations('Club.Inbox');
  const notifications = useClubNotifications(selectedClub);

  if (!notifications) return null;
  if (notifications.status === 'pending') return <SkeletonList />;
  if (notifications.status === 'error')
    return <p>{notifications.error.message}</p>;
  if (!notifications.data.length) return <Empty>{t('empty')}</Empty>;
  return (
    <div className="mk-list">
      {notifications.data.map(NotificationItemIteratee)}
    </div>
  );
};

const NotificationItemIteratee = (data: ClubNotification) => {
  switch (data.event) {
    case 'affiliation_request':
      return <AffiliationNotificationLi key={data.notification.id} {...data} />;
    case 'affiliation_request_approved':
      return (
        <NotificationItem
          key={data.notification.id}
          is_seen={data.notification.isSeen}
        >
          <div>
            {data.player?.nickname} is officially user {data.user?.username}
          </div>
        </NotificationItem>
      );
    case 'affiliation_request_rejected':
      return (
        <NotificationItem
          key={data.notification.id}
          is_seen={data.notification.isSeen}
        >
          <div>
            {data.user?.username}&apos;s request to affiliate with{' '}
            {data.player?.nickname} was rejected
          </div>
        </NotificationItem>
      );
    default:
      return null;
  }
};

export default ClubInbox;
