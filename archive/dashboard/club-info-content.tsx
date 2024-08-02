'use client';

import { InfoItem } from '@/app/tournaments/[id]/dashboard/tabs/main';
import Empty from '@/components/empty';
import { useClubInfo } from '@/components/hooks/query-hooks/use-club-info';
import { useUser } from '@/components/hooks/query-hooks/use-user';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarDays, Info } from 'lucide-react';

export default function ClubInfoContent({ userId }: { userId: string }) {
  const user = useUser(userId);
  if (!user.data) return null;
  return <ClubInfo clubId={user.data.selected_club} />;
}

const ClubInfo = ({ clubId }: { clubId: string }) => {
  const club = useClubInfo(clubId);
  if (club.isPending) return <Skeleton className="h-24 w-full" />;
  if (!club.data) return <Empty />;

  const createdAt = club.data?.created_at?.toLocaleDateString(['en-GB'], {
    dateStyle: 'medium',
  });

  console.log(clubId)

  return (
    <Card className="items-left flex w-full flex-col gap-8 p-4">
      {club.data.description && (
        <InfoItem icon={<Info />} value={club.data.description} />
      )}
      <InfoItem icon={<CalendarDays />} value={createdAt} />
    </Card>
  );
};
