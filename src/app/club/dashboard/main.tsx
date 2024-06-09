'use client';

import ClubSelectDrawer from '@/app/club/dashboard/club-select-drawer';
import { InfoItem } from '@/components/dashboard/tabs/main';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DatabaseClub } from '@/lib/db/schema/tournaments';
import { User } from 'lucia';
import { CalendarDays, Info, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FC, ReactNode } from 'react';

const Main: FC<{ clubs: DatabaseClub[]; selected: string; user: User }> = ({
  clubs,
  selected,
  user,
}) => {
  const selectedClub = clubs.find((club) => club.id === selected) || clubs[0];
  const selectNew = (
    <ClubSelectDrawer clubs={clubs} selected={selectedClub} user={user} />
  );
  return <ClubInfo club={selectedClub} selectNew={selectNew} />;
};

const ClubInfo = ({
  club,
  selectNew,
}: {
  club: DatabaseClub;
  selectNew: ReactNode;
}) => {
  const { created_at, name, description } = club;
  const navigate = useRouter();
  const createdAt = created_at?.toLocaleDateString(['en-GB'], {
    dateStyle: 'medium',
  });

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="truncate whitespace-break-spaces text-balance text-4xl font-bold">
        {name}
        <span className="whitespace-nowrap">
          {selectNew}
          <Button
            size={'icon'}
            variant={'ghost'}
            style={{ backgroundColor: 'transparent' }}
            onClick={() => navigate.push('dashboard/settings')}
          >
            <Settings />
          </Button>
        </span>
      </div>
      <Card className="items-left flex w-full flex-col gap-8 p-4">
        {description && <InfoItem icon={<Info />} value={description} />}
        <InfoItem icon={<CalendarDays />} value={createdAt} />
      </Card>
    </div>
  );
};

export default Main;
