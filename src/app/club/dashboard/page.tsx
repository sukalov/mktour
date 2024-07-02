'use client';

import { InfoItem } from '@/components/dashboard/tabs/main';
import { useClubInfo } from '@/components/hooks/query-hooks/use-club-info';
import { useUser } from '@/components/hooks/query-hooks/use-user';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { User } from 'lucia';
import { CalendarDays, Info } from 'lucide-react';

export default function ClubInfo() {
  const user = useUser();
  if (!user.data) return <></>;
  return <ClubInfoContent user={user.data} />;
}

function ClubInfoContent({ user }: { user: User }) {
  const club = useClubInfo(user.selected_club);

  if (!club.data) return <Skeleton className="h-24 w-full" />;
  const createdAt = club.data?.created_at?.toLocaleDateString(['en-GB'], {
    dateStyle: 'medium',
  });

  return (
    <Card className="items-left flex w-full flex-col gap-8 p-4">
      {club.data.description ? (
        <InfoItem icon={<Info />} value={club.data.description} />
      ) : (
        <InfoItem icon={<Info />} value={'...'} />
      )}
      <InfoItem icon={<CalendarDays />} value={createdAt} />
    </Card>
  );
}
