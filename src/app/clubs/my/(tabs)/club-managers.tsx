'use client';

import { useClubManagers } from '@/components/hooks/query-hooks/use-club-managers';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ClubManagers } from '@/lib/actions/club-managing';
import { UserPlus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { FC } from 'react';

const ClubManagersList: FC<{ id: string }> = ({ id }) => {
  const { data, isLoading } = useClubManagers(id);
  // const [addingManager, setAddingManager] = useState(false);
  const t = useTranslations('Club');

  return (
    <div className="flex flex-col gap-2 px-6 sm:px-0">
      {t('managers list')}
      <Card className="border-none px-6 py-3 shadow-none sm:border-solid sm:px-12 sm:shadow-2xs">
        {isLoading ? (
          <Skeleton className="h-12 w-full" />
        ) : (
          <ul className="list-disc">{data?.map(ManagersIteratee)}</ul>
        )}
      </Card>
      <Button
        size="icon"
        variant="outline"
        onClick={console.log}
        className="flex w-full gap-2"
      >
        <UserPlus size={18} />
        {t('add manager')}
      </Button>
    </div>
  );
};

const ManagersIteratee = (manager: ClubManagers) => (
  <li className="not-last:pb-2" key={manager.user?.id}>
    <ManagerItem manager={manager} />
  </li>
);

const ManagerItem: FC<{ manager: ClubManagers }> = ({ manager }) => {
  const t = useTranslations('Status');

  return (
    <Link href={`/user/${manager.user?.username}`} key={manager.user?.id}>
      {manager.user?.username}
      &nbsp;
      <span className="text-muted-foreground">
        {t(manager.clubs_to_users!.status)}
      </span>
    </Link>
  );
};

export default ClubManagersList;
