'use client';

import Empty from '@/components/empty';
import { useClubNotifications } from '@/components/hooks/query-hooks/use-club-notifications';
import useOnReach from '@/components/hooks/use-on-reach';
import {
  AffiliationNotificationLi,
  NotificationItem,
} from '@/components/notification-items';
import SkeletonList from '@/components/skeleton-list';
import { ClubNotificationExtended } from '@/server/db/zod/notifications';
import { useTranslations } from 'next-intl';
import { FC } from 'react';

const ClubInbox: FC<{ selectedClub: string }> = ({ selectedClub }) => {
  const t = useTranslations('Club.Inbox');
  const {
    data: notifications,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useClubNotifications(selectedClub);

  const ref = useOnReach(fetchNextPage);

  if (!notifications) return null;
  if (status === 'error') return <p>{error.message}</p>;
  const allNotifications = notifications.pages.flatMap(
    (page) => page.notifications,
  );

  if (!allNotifications.length) return <Empty>{t('empty')}</Empty>;
  return (
    <div className="mk-list">
      {allNotifications.map(NotificationItemIteratee)}
      {isFetchingNextPage && <SkeletonList />}
      {hasNextPage && <div ref={ref} />}
    </div>
  );
};

const NotificationItemIteratee = (data: ClubNotificationExtended) => {
  switch (data.event) {
    case 'affiliation_request':
      return <AffiliationNotificationLi key={data.id} {...data} />;
    case 'affiliation_request_approved':
      return (
        <NotificationItem
          notificationId={data.id}
          key={data.id}
          is_seen={data.isSeen}
        >
          {data.player?.nickname} is officially user {data.user?.username}
        </NotificationItem>
      );
    case 'affiliation_request_rejected':
      return (
        <NotificationItem
          notificationId={data.id}
          key={data.id}
          is_seen={data.isSeen}
        >
          <div>
            {data.user?.username}&apos;s request to affiliate with{' '}
            {data.player?.nickname} was rejected
          </div>
        </NotificationItem>
      );
    case 'manager_left':
      return (
        <NotificationItem
          notificationId={data.id}
          key={data.id}
          is_seen={data.isSeen}
        >
          {data.event}
          {JSON.stringify(data.metadata)}
        </NotificationItem>
      );
    case 'affiliation_cancelled':
      return (
        <NotificationItem
          notificationId={data.id}
          key={data.id}
          is_seen={data.isSeen}
        >
          {data.event}
          {JSON.stringify(data.metadata)}
        </NotificationItem>
      );
    default:
      return null;
  }
};

export default ClubInbox;
