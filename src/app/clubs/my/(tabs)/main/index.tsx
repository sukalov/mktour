import Desktop from '@/app/clubs/my/(tabs)/main/main-desktop';
import Mobile from '@/app/clubs/my/(tabs)/main/main-mobile';
import { ClubTabProps } from '@/app/clubs/my/tabMap';
import Empty from '@/components/empty';
import { useClubInfo } from '@/components/hooks/query-hooks/use-club-info';
import { MediaQueryContext } from '@/components/providers/media-query-context';
import { Skeleton } from '@/components/ui/skeleton';
import { DatabaseClub } from '@/server/db/schema/clubs';
import { FC, useContext } from 'react';

const ClubMain: FC<ClubTabProps> = ({ selectedClub, userId }) => {
  const club = useClubInfo(selectedClub);
  const { isMobile } = useContext(MediaQueryContext);
  const Component: FC<ClubTabProps & { club: DatabaseClub }> = isMobile
    ? Mobile
    : Desktop;

  if (club.isPending) return <Skeleton className="h-24 w-full" />;
  if (!club.data) return <Empty />;

  return (
    <Component club={club.data} selectedClub={selectedClub} userId={userId} />
  );
};

export default ClubMain;
