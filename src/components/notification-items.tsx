'use client';

import FormattedMessage from '@/components/formatted-message';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AffiliationNotification } from '@/lib/actions/get-user-notifications';
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
        <div className="ml-3 flex gap-2">
          <Button>
            <Check />{' '}
          </Button>
          <Button variant="destructive">
            <X />{' '}
          </Button>
        </div>
      </div>
    </Card>
  );
};
