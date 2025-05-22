'use client';

import AddManagerDrawer from '@/app/clubs/my/(tabs)/settings/add-manager-drawer';
import FormattedMessage from '@/components/formatted-message';
import { useClubManagers } from '@/components/hooks/query-hooks/use-club-managers';
import { Card } from '@/components/ui/card';
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
    <div className="flex flex-col sm:px-0">
      <div className="pl-4">
        <FormattedMessage id="Club.managers list" />
      </div>
      <Card className="border-none px-6 py-3 shadow-none sm:border-solid sm:px-12 sm:shadow-2xs">
        {status !== 'success' ? (
          <Skeleton className="h-12 w-full" />
        ) : (
          <ul className="list-disc pl-4">{data.map(ManagersIteratee)}</ul>
        )}
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
