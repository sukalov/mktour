'use client';

import { InfoItem } from '@/components/dashboard/tabs/main';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DatabaseClub } from '@/lib/db/schema/tournaments';
import { CalendarDays, Info, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FC } from 'react';

const Main: FC<{ club: DatabaseClub }> = ({ club }) => {
  return <ClubInfo club={club} />;
};

const ClubInfo = ({ club }: { club: DatabaseClub }) => {
  const { created_at, name, description } = club;
  const navigate = useRouter();
  const createdAt = created_at?.toLocaleDateString(['en-GB'], {
    dateStyle: 'medium',
  });

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex items-end justify-between">
        <div className="truncate whitespace-break-spaces text-4xl font-bold">
          {name}
        </div>
        <Button
          variant={'ghost'}
          onClick={() => navigate.push('dashboard/settings')}
        >
          <Settings />
        </Button>
      </div>
      <Card className="items-left flex w-full flex-col gap-8 p-4">
        <InfoItem icon={<Info />} value={description} />
        <InfoItem icon={<CalendarDays />} value={createdAt} />
      </Card>
    </div>
  );
};

export default Main;
