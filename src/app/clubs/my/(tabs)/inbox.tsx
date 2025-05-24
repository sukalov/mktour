'use client';

import { ClubTabProps } from '@/app/clubs/my/tabMap';
import Empty from '@/components/empty';
import { useClubNotifications } from '@/components/hooks/query-hooks/use-club-notifications';
import { AffiliationNotificationLi } from '@/components/notification-items';
import SkeletonList from '@/components/skeleton-list';
import { ClubNotification } from '@/server/queries/get-club-notifications';
import { useTranslations } from 'next-intl';

const ClubInbox = ({ selectedClub }: Pick<ClubTabProps, 'selectedClub'>) => {
  const t = useTranslations('Club.Inbox');
  const notifications = useClubNotifications(selectedClub);

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
  if (data.type === 'affiliation_request')
    return <AffiliationNotificationLi key={data.notification.id} {...data} />;
  return null;
};

export default ClubInbox;
