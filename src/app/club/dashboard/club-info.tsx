'use client';

import { InfoItem } from '@/components/dashboard/tabs/main';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getClubInfo } from '@/lib/actions/club-managing';
import {
  useMutationState,
  useQuery
} from '@tanstack/react-query';
import { User } from 'lucia';
import { CalendarDays, Info } from 'lucide-react';

export default function ClubInfo({ user }: { user: User }) {
  const club = useQuery({
    queryKey: ['user', 'clubs', 'selected-club-info'],
    queryFn: () => getClubInfo(user.selected_club),
    staleTime: 10 * 60 * 1000
  });

  const [mutationState] = useMutationState({
    filters: { mutationKey: ['select-club'] },
    select: (mutation) => mutation.state,
  });
  if (!club.data || mutationState?.status === 'pending')
    return <Skeleton className="h-24 w-full" />;
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
