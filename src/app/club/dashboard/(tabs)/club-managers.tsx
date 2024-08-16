'use client';

import { useClubManagers } from '@/components/hooks/query-hooks/use-club-managers';
import { Card } from '@/components/ui/card';
import { ClubManagers } from '@/lib/actions/club-managing';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { FC } from 'react';

const ClubManagersList: FC<{ id: string }> = ({ id }) => {
  const { data } = useClubManagers(id);
  const t = useTranslations('Club');
  return (
    <div className="flex flex-col gap-2 px-4">
      {t('managers list')}
      <Card className="p-4">{data?.map(ManagersIteratee)}</Card>
    </div>
  );
};

const ManagersIteratee = (manager: ClubManagers) => (
  <ManagerItem key={manager.user?.id} manager={manager} />
);

const ManagerItem: FC<{ manager: ClubManagers }> = ({ manager }) => {
  const t = useTranslations('Status');

  return (
    <Link href={`/user/${manager.user?.username}`} key={manager.user?.id}>
      {manager.user?.username} ({t(manager.clubs_to_users?.status)})
    </Link>
  );
};

export default ClubManagersList;
