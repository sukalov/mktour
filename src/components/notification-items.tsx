'use client';

import { LoadingSpinner } from '@/app/loading';
import FormattedMessage from '@/components/formatted-message';
import useAffiliationAcceptMutation from '@/components/hooks/mutation-hooks/use-affiliation-accept';
import useAffiliationRejectMutation from '@/components/hooks/mutation-hooks/use-affiliation-reject';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Item } from '@/components/ui/item';
import { ClubNotification } from '@/server/queries/get-club-notifications';
import {
  AnyUserNotificationExtended,
  UserNotificationExtended,
} from '@/server/queries/get-user-notifications';
import { UserNotificationEvent } from '@/types/notifications';
import { useQueryClient } from '@tanstack/react-query';
import {
  Check,
  CornerDownRightIcon,
  GitPullRequestCreateArrow,
  LucideIcon,
  Medal,
  ShieldUser,
  Skull,
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
    <NotificationCard
      key={notification.id}
      is_seen={notification.is_seen}
      className="flex flex-col gap-2"
    >
      <p className="text-muted-foreground flex items-center gap-2 text-xs">
        <GitPullRequestCreateArrow className="size-4" />
        <FormattedMessage id="Club.Inbox.affiliation" />
      </p>
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2">
                <Link href={`/user/${user?.username}`}>{user?.username}</Link>
              </div>
              <div className="flex items-center">
                <CornerDownRightIcon className="text-muted-foreground mx-2 size-4" />
                <Link href={`/player/${player?.id}`}>{player?.nickname}</Link>
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

export const UserNotificationLi: FC<AnyUserNotificationExtended> = (props) => {
  const { event, notification } = props;
  const { messageId, Icon } = useUserNotificationItem(event);

  return (
    <NotificationCard
      className="flex flex-col gap-1"
      key={notification.id}
      is_seen={notification.is_seen}
    >
      <p className="text-muted-foreground flex items-center gap-1 text-xs">
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

const NotificationContent: FC<AnyUserNotificationExtended> = (notification) => {
  if (notification.event === 'became_club_manager')
    return <ManagerNotification {...notification} />;
  if (notification.event === 'tournament_won')
    return <TournamentNotification {...notification} />;

  const { player, club } = notification;

  return (
    <div className="flex items-center gap-2 text-xs">
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

const ManagerNotification: FC<Props<'became_club_manager'>> = (
  notification,
) => {
  if (!notification.club) return null;
  return <div>{notification.club.name}</div>;
};
type Props<T extends UserNotificationEvent> = UserNotificationExtended<T>;

const TournamentNotification: FC<
  UserNotificationExtended<'tournament_won'>
> = ({ metadata }) => {
  return <div>{metadata.name}</div>;
};

const useUserNotificationItem = (event: UserNotificationEvent) => {
  const messageId = messageIdMap[event];
  const Icon: LucideIcon = iconMap[event];

  return { messageId, Icon };
};

const messageIdMap: Record<
  UserNotificationEvent,
  keyof IntlMessages['Notifications']['User']
> = {
  affiliation_approved: 'affiliation approved',
  affiliation_rejected: 'affiliation rejected',
  became_club_manager: 'became club manager',
  tournament_won: 'tournament won',
  removed_from_club_managers: 'removed from club managers',
};

const iconMap: Record<UserNotificationEvent, LucideIcon> = {
  affiliation_approved: Check,
  affiliation_rejected: X,
  became_club_manager: ShieldUser,
  tournament_won: Medal,
  removed_from_club_managers: Skull,
};

export const NotificationItem = ({
  children,
  is_seen,
}: {
  children: React.ReactNode;
  is_seen: boolean;
}) => {
  return (
    <Card className={`${is_seen && 'opacity-70'}`}>
      <CardContent>
        <Item>{children}</Item>
      </CardContent>
    </Card>
  );
};
