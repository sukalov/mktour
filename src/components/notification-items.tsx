'use client';

import FormattedMessage from '@/components/formatted-message';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AffiliationNotification } from '@/server/actions/get-user-notifications';
import { Check, Pointer, UserRound, X } from 'lucide-react';
import Link from 'next/link';

export const AffiliationNotificationLi = ({
  affiliation,
  notification,
  user,
  player,
}: AffiliationNotification) => {
  if (!affiliation) return null;
  return (
    <Card className="mk-card flex flex-col gap-2" key={notification.id}>
      <p className="text-muted-foreground text-xs">
        <FormattedMessage id="Club.Inbox.affiliation" />
      </p>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1">
              <UserRound className="size-4" />
              <Link href={`/user/${user?.username}`} className="mk-link">
                {user?.username}
              </Link>
            </div>
            <Pointer className="size-4 rotate-90" />
            <Link href={`/player/${player?.id}`} className="mk-link">
              {player?.nickname}
            </Link>
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
