'use client';

import { LoadingSpinner } from '@/app/loading';
import FormattedMessage from '@/components/formatted-message';
import useAffiliationAcceptMutation from '@/components/hooks/mutation-hooks/use-affiliation-accept';
import useAffiliationRejectMutation from '@/components/hooks/mutation-hooks/use-affiliation-reject';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AffiliationNotification } from '@/server/queries/get-user-notifications';
import { useQueryClient } from '@tanstack/react-query';
import { Check, Pointer, UserRound, X } from 'lucide-react';
import Link from 'next/link';

export const AffiliationNotificationLi = ({
  affiliation,
  notification,
  player,
  user,
}: AffiliationNotification) => {
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
    <Card className="mk-card flex flex-col gap-2" key={notification.id}>
      <p className="text-muted-foreground text-xs">
        <FormattedMessage id="Club.Inbox.affiliation" />
      </p>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex flex-col justify-center gap-2">
            <div className="flex items-center gap-2">
              <UserRound className="size-4" />
              <Link href={`/user/${user?.username}`} className="mk-link">
                {user?.username}
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <Pointer className="size-4" />
              <Link href={`/player/${player?.id}`} className="mk-link">
                {player?.nickname}
              </Link>
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
    </Card>
  );
};
