'use client';

import { ClubTabProps } from '@/app/clubs/my/tabMap';
import Empty from '@/components/empty';
import { useClubNotifications } from '@/components/hooks/query-hooks/use-club-notifications';
import { DatabaseNotification } from '@/lib/db/schema/notifications';
import { DatabaseAffiliation } from '@/lib/db/schema/players';
import { useTranslations } from 'next-intl';

const ClubInbox = ({ selectedClub }: Pick<ClubTabProps, 'selectedClub'>) => {
  const t = useTranslations('Club.Inbox');
  const notifications = useClubNotifications(selectedClub);
  if (notifications.status === 'pending') return <p>{t('loading')}</p>;
  if (notifications.status === 'error')
    return <p>{notifications.error.message}</p>;
  if (notifications.data.length < 1)
    return <Empty className="p-2">{t('inbox')}</Empty>;
  return (
    <div className="mk-list">{notifications.data.map(NotificationItem)}</div>
  );
};

export default ClubInbox;

const NotificationItem = ({
  notification,
  affiliation,
}: {
  notification: DatabaseNotification;
  affiliation: DatabaseAffiliation | null;
}) => {
  return (
    <div className="py-8" key={notification.id}>
      {JSON.stringify({ notification, affiliation }, null, 4)}
    </div>
  );
};
