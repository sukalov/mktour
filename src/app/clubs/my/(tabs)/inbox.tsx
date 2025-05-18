'use client';

import { ClubTabProps } from '@/app/clubs/my/tabMap';
import Empty from '@/components/empty';
import FormattedMessage from '@/components/formatted-message';
import { useClubNotifications } from '@/components/hooks/query-hooks/use-club-notifications';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DatabaseNotification } from '@/lib/db/schema/notifications';
import { DatabaseAffiliation, DatabasePlayer } from '@/lib/db/schema/players';
import { DatabaseUser } from '@/lib/db/schema/users';
import { Check, Pointer, UserRound, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

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
  user: DatabaseUser | null;
  player: DatabasePlayer | null;
}) => <NotificationItem key={data.notification?.id} {...data} />;

const NotificationItem = ({
  affiliation,
  notification,
  user,
  player,
}: {
  affiliation: DatabaseAffiliation | null;
  notification: DatabaseNotification;
  user: DatabaseUser | null;
  player: DatabasePlayer | null;
}) => {
  if (!affiliation) return null;
  return (
    <Card className="mk-card flex flex-col gap-2" key={notification.id}>
      <p className="text-muted-foreground text-xs">
        <FormattedMessage id="Club.Inbox.affiliation" />
      </p>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <UserRound className="size-4" />
              <Link href={`/user/${user?.username}`} className="mk-link">
                {user?.username}
              </Link>
            </div>
            <Pointer className="size-4 rotate-90" />
            <div>
              <Link href={`/player/${player?.id}`} className="mk-link">
                {player?.nickname}
              </Link>
            </div>
          </div>
          <p className="text-muted-foreground text-2xs">
            {new Date(notification.created_at).toLocaleString()}
          </p>
        </div>
        <div className="ml-3 flex gap-1">
          <Button size="icon" className="size-8">
            <Check />{' '}
          </Button>
          <Button variant="destructive" size="icon" className="size-8">
            <X />{' '}
          </Button>
        </div>
      </div>
    </Card>
  );
};
