'use client';

import { ClubTabProps } from '@/app/clubs/my/tabMap';
import Empty from '@/components/empty';
import { useClubNotifications } from '@/components/hooks/query-hooks/use-club-notifications';
import { AffiliationNotificationLi } from '@/components/notification-items';
import { AffiliationNotification } from '@/lib/actions/get-user-notifications';
import { useTranslations } from 'next-intl';

const ClubInbox = ({ selectedClub }: Pick<ClubTabProps, 'selectedClub'>) => {
  const t = useTranslations('Club.Inbox');
  const notifications = useClubNotifications(selectedClub);

  if (notifications.status === 'pending') return <p>{t('loading')}</p>;
  if (notifications.status === 'error')
    return <p>{notifications.error.message}</p>;
  if (notifications.data.length < 1)
    return <Empty className="p-2">{t('empty')}</Empty>;
  return (
    <div className="mk-list">
      {notifications.data.map(NotificationItemIteratee)}
    </div>
  );
};

export default ClubInbox;

const NotificationItemIteratee = (data: AffiliationNotification) => (
  <AffiliationNotificationLi key={data.notification?.id} {...data} />
);
