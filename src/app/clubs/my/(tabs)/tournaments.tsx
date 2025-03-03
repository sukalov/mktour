import { ClubTabProps } from '@/app/clubs/my/tabMap';
import Empty from '@/components/empty';
import FormattedMessage from '@/components/formatted-message';
import { useClubTournaments } from '@/components/hooks/query-hooks/use-club-tournaments';
import SkeletonList from '@/components/skeleton-list';
import TournamentItemIteratee from '@/components/tournament-item';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FC } from 'react';

const ClubDashboardTournaments: FC<ClubTabProps> = ({ selectedClub }) => {
  const { data, isLoading, isError, failureReason } =
    useClubTournaments(selectedClub);

  if (isLoading) return <SkeletonList length={4} height={16} />;
  if (!data || !data.length)
    return (
      <Empty className="px-4">
        <FormattedMessage id="Empty.tournaments" />
        <MakeTournament />
      </Empty>
    );
  if (isError) return <p className="w-full">{failureReason?.message}</p>;
  return (
    <div className="mb-2 flex flex-col gap-2">
      {data.map((props) => (
        <TournamentItemIteratee key={props.id} tournament={props} />
      ))}
    </div>
  );
};

const MakeTournament = () => (
  <Link
    href="/tournaments/create"
    className="mt-4 flex items-center justify-center"
  >
    <Button size="lg" variant="default">
      <FormattedMessage id="Home.make tournament" />
    </Button>
  </Link>
);

export default ClubDashboardTournaments;
