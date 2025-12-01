'use client';

import Mobile from '@/app/clubs/my/(tabs)/main/mobile';
import { ClubTabProps } from '@/app/clubs/my/tabMap';
import Empty from '@/components/empty';
import { useClubInfo } from '@/components/hooks/query-hooks/use-club-info';
import { Skeleton } from '@/components/ui/skeleton';
import { FC } from 'react';

const ClubMain: FC<ClubTabProps> = ({ selectedClub, userId }) => {
  const club = useClubInfo(selectedClub);

  if (club.isPending) return <Skeleton className="h-24 w-full" />;
  if (!club.data) return <Empty />;

  return (
    <Mobile club={club.data} selectedClub={selectedClub} userId={userId} />
  );
};

export default ClubMain;
