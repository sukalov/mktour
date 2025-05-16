'use client';

import { ClubTabProps } from '@/app/clubs/my/tabMap';
import Empty from '@/components/empty';
import { useClubNotifications } from '@/components/hooks/query-hooks/use-club-notifications';
import { useUser } from '@/components/hooks/query-hooks/use-user';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DatabaseNotification } from '@/lib/db/schema/notifications';
import { DatabaseAffiliation } from '@/lib/db/schema/players';
import { Check, X } from 'lucide-react';
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

const NotificationItemIteratee = (data: {
  notification: DatabaseNotification;
  affiliation: DatabaseAffiliation | null;
}) => <NotificationItem key={data.affiliation?.id} {...data} />;

const NotificationItem = ({
  notification,
  affiliation,
}: {
  notification: DatabaseNotification;
  affiliation: DatabaseAffiliation | null;
}) => {
  const user = useUser(notification.user_id);

  return (
    <Card className="mk-card" key={notification.id}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">
            {notification.notification_type === 'affiliation_request'
              ? `Affiliation request from user ${user.data?.username}`
              : 'Unknown notification type'}
          </p>
          <p className="text-xs text-gray-500">
            Created at: {new Date(notification.created_at).toLocaleString()}
          </p>
        </div>
        <Button size={'icon'}>
          <Check />{' '}
        </Button>
        <Button variant={'destructive'} size={'icon'}>
          <X />{' '}
        </Button>
      </div>
      {affiliation && (
        <div className="mt-2 text-sm text-gray-700">
          <p>Affiliation ID: {notification.id}</p>
          <p>Status: {affiliation.status}</p>
        </div>
      )}
    </Card>
  );
};
