'use client';

import { LoadingSpinner } from '@/app/loading';
import FormattedMessage from '@/components/formatted-message';
import useAffiliationAcceptMutation from '@/components/hooks/mutation-hooks/use-affiliation-accept';
import useAffiliationRejectMutation from '@/components/hooks/mutation-hooks/use-affiliation-reject';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ClubNotification } from '@/server/queries/get-club-notifications';
import { UserNotification } from '@/server/queries/get-user-notifications';
import { useQueryClient } from '@tanstack/react-query';
import {
  Check,
  CornerDownRightIcon,
  GitPullRequestCreateArrow,
  LucideIcon,
  Medal,
  ShieldUser,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { FC, HTMLAttributes, PropsWithChildren } from 'react';

export const AffiliationNotificationLi = ({
  affiliation,
  notification,
  player,
  user,
}: ClubNotification) => {
  const queryClient = useQueryClient();
  const { mutate: acceptAffiliation, isPending: pendingAccept } =
    useAffiliationAcceptMutation({
      queryClient,
    });
  const { mutate: rejectMutation, isPending: pendingReject } =
    useAffiliationRejectMutation({
      queryClient,
    });

  const isPending = pendingAccept || pendingReject;

  if (!user || !affiliation) return null;

  const variables = {
    clubId: notification.club_id,
    affiliationId: affiliation.id,
    notificationId: notification.id,
  };

  const handleAccept = (accept: boolean) => {
    const fn = accept ? acceptAffiliation : rejectMutation;
    fn(variables);
  };

  if (!affiliation) return null;

  return (
    <NotificationCard key={notification.id} is_seen={notification.is_seen}>
      <p className="text-muted-foreground flex items-center gap-2 text-xs">
        <GitPullRequestCreateArrow className="size-4" />
        <FormattedMessage id="Club.Inbox.affiliation" />
      </p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-sm">
            <div className="flex flex-col justify-center gap-2">
              <div className="flex items-center gap-2">
                <Link href={`/user/${user?.username}`} className="mk-link">
                  {user?.username}
                </Link>
              </div>
              <div className="flex items-center">
                <CornerDownRightIcon className="mx-2 size-4" />
                <Link href={`/player/${player?.id}`} className="mk-link">
                  {player?.nickname}
                </Link>
              </div>
            </div>
          </div>
        </div>
        {isPending ? (
          <LoadingSpinner />
        ) : (
          <div className="ml-3 flex gap-2">
            <Button onClick={() => handleAccept(true)} variant="secondary">
              <Check />{' '}
            </Button>
            <Button onClick={() => handleAccept(false)} variant="destructive">
              <X />{' '}
            </Button>
          </div>
        )}
      </div>
    </NotificationCard>
  );
};

export const UserNotificationLi: FC<UserNotification> = (props) => {
  const { type, notification } = props;
  const { messageId, Icon } = useUserNotificationItem(type);

  return (
    <NotificationCard key={notification.id} is_seen={notification.is_seen}>
      <p className="text-muted-foreground flex items-center gap-2 text-xs">
        <Icon size={16} />
        <FormattedMessage id={`Notifications.User.${messageId}`} />
      </p>
      <NotificationContent {...props} />
    </NotificationCard>
  );
};

const NotificationCard: FC<
  PropsWithChildren & {
    is_seen: boolean;
    className?: HTMLAttributes<HTMLDivElement>['className'];
  }
> = ({ is_seen, className, children }) => (
  <Card className={`mk-card ${is_seen && 'opacity-70'} ${className}`}>
    {children}
  </Card>
);

const NotificationContent: FC<UserNotification> = (notification) => {
  if (notification.type === 'became_club_manager')
    return <ManagerNotification {...notification} />;
  if (notification.type === 'tournament_won')
    return <TournamentNotification {...notification} />;

  const { player, club } = notification;

  return (
    <div className="flex items-center gap-2 text-sm">
      <Link href={`/player/${player?.id}`} className="mk-link">
        {player?.nickname}
      </Link>
      from
      <Link href={`/clubs/${club?.id}`} className="mk-link">
        {club?.name}
      </Link>
    </div>
  );
};

const ManagerNotification: FC<UserNotification> = (notification) => {
  if (notification.type === 'became_club_manager')
    return <div>{notification.club.name}</div>;
};

const TournamentNotification: FC<UserNotification> = ({ notification }) => {
  if (
    notification.notification_type === 'tournament_won' &&
    notification.metadata &&
    'name' in notification?.metadata
  )
    // FIXME wtf
    return <div>{notification.metadata.name}</div>;
};

const useUserNotificationItem = (type: UserNotification['type']) => {
  const messageId = messageIdMap[type];
  const Icon: LucideIcon = iconMap[type];

  return { messageId, Icon };
};

const messageIdMap: Record<
  UserNotification['type'],
  keyof IntlMessages['Notifications']['User']
> = {
  affiliation_approved: 'affiliation approved',
  affiliation_rejected: 'affiliation rejected',
  became_club_manager: 'became club manager',
  tournament_won: 'tournament won',
};

const iconMap: Record<UserNotification['type'], LucideIcon> = {
  affiliation_approved: Check,
  affiliation_rejected: X,
  became_club_manager: ShieldUser,
  tournament_won: Medal,
};
