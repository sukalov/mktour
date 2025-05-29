'use client';

import AddManagerDrawer from '@/app/clubs/my/(tabs)/settings/add-manager-drawer';
import FormattedMessage from '@/components/formatted-message';
import { useClubManagers } from '@/components/hooks/query-hooks/use-club-managers';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ClubManager } from '@/server/mutations/club-managing';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { FC } from 'react';
import { toast } from 'sonner';

const ClubManagersList: FC<{ clubId: string; userId: string }> = ({
  clubId,
  userId,
}) => {
  const { data, status } = useClubManagers(clubId);
  const t = useTranslations('Club.Settings');

  if (status === 'error') toast.error(t('search users error'));

  return (
    <div className="flex flex-col gap-2 sm:px-0">
      <div className="pl-4 font-bold">
        <FormattedMessage id="Club.managers list" />
      </div>
      <Card className="border-none shadow-none sm:border-solid sm:shadow-2xs">
        <CardContent className="max-sm:p-0 sm:py-8">
          {status !== 'success' ? (
            <Skeleton className="h-12 w-full" />
          ) : (
            <ul className="list-disc pl-4">{data.map(ManagersIteratee)}</ul>
          )}
        </CardContent>
      </Card>
      <AddManagerDrawer clubId={clubId} userId={userId} />
    </div>
  );
};

const ManagersIteratee = (manager: ClubManager) => (
  <li className="not-last:pb-2" key={manager.user.id}>
    <ManagerItem manager={manager} />
  </li>
);

const ManagerItem: FC<{ manager: ClubManager }> = ({ manager }) => {
  const t = useTranslations('Status');

  return (
    <Link href={`/user/${manager.user.username}`} key={manager.user.id}>
      {manager.user.username}
      &nbsp;
      <span className="text-muted-foreground">
        {t(manager.clubs_to_users.status)}
      </span>
    </Link>
  );
};

export default ClubManagersList;
