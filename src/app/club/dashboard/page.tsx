import { clubQueryClient } from '@/app/club/dashboard/prefetch';
import { InfoItem } from '@/components/dashboard/tabs/main';
import { Card } from '@/components/ui/card';
import { getClubInfo } from '@/lib/actions/club-managing';
import { getUser } from '@/lib/auth/utils';
import { DatabaseClub } from '@/lib/db/schema/tournaments';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { User } from 'lucia';
import { CalendarDays, Info } from 'lucide-react';

export default async function ClubPage() {
  const user = (await clubQueryClient.fetchQuery({
    queryKey: ['user'],
    queryFn: getUser,
  })) as User;

  const club = (await clubQueryClient.fetchQuery({
    queryKey: ['user', 'clubs', 'selected-club-info'],
    queryFn: () => getClubInfo(user.selected_club),
  })) as DatabaseClub;
  const createdAt = club.created_at?.toLocaleDateString(['en-GB'], {
    dateStyle: 'medium',
  });
  return (
    <HydrationBoundary state={dehydrate(clubQueryClient)}>
      <Card className="items-left flex w-full flex-col gap-8 p-4">
        {club.description ? (
          <InfoItem icon={<Info />} value={club.description} />
        ) : (
          <InfoItem icon={<Info />} value={'...'} />
        )}
        <InfoItem icon={<CalendarDays />} value={createdAt} />
      </Card>
    </HydrationBoundary>
  );
}
