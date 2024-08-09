import Desktop from '@/app/club/dashboard/(tabs)/main/main-desktop';
import Mobile from '@/app/club/dashboard/(tabs)/main/main-mobile';
import { ClubTabProps } from '@/app/club/dashboard/dashboard';
import Empty from '@/components/empty';
import { useClubInfo } from '@/components/hooks/query-hooks/use-club-info';
import { MediaQueryContext } from '@/components/providers/media-query-context';
import { Skeleton } from '@/components/ui/skeleton';
import { createElement as $, FC, useContext } from 'react';

const ClubMain: FC<ClubTabProps> = ({ selectedClub, userId }) => {
  const club = useClubInfo(selectedClub);
  const { isTablet } = useContext(MediaQueryContext);
  const component = $(!isTablet ? Desktop : Mobile, {
    club,
    selectedClub,
    userId,
  });

  if (club.isPending) return <Skeleton className="h-24 w-full" />;
  if (!club.data) return <Empty />;

  return component;
};

export default ClubMain;
