import { ClubTabProps } from '@/app/clubs/my/tabMap';
import Empty from '@/components/empty';
import FormattedMessage from '@/components/formatted-message';
import { useClubTournaments } from '@/components/hooks/query-hooks/use-club-tournaments';
import SkeletonList from '@/components/skeleton-list';
import TournamentItemIteratee from '@/components/tournament-item';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FC } from 'react';

const ClubDashboardTournaments: FC<ClubTabProps> = ({
  selectedClub,
  statusInClub,
}) => {
  const { data, isLoading, isError, failureReason } =
    useClubTournaments(selectedClub);

  if (isLoading) return <SkeletonList length={10} />;
  if (!data || !data.length)
    return (
      <Empty className="mk-container text-center text-balance">
        <FormattedMessage id="Empty.tournaments" />
        <br />
        {statusInClub && <MakeTournament />}
      </Empty>
    );
  if (isError) return <p className="w-full">{failureReason?.message}</p>;
  return (
    <div className="mk-list">
      {data.map((props) => (
        <TournamentItemIteratee key={props.id} tournament={props} />
      ))}
    </div>
  );
};

const MakeTournament = () => (
  <Button size="lg" variant="default" asChild>
    <Link
      href="/tournaments/create"
      className="mt-4 flex items-center justify-center"
    >
      <FormattedMessage id="Home.make tournament" />
    </Link>
  </Button>
);

export default ClubDashboardTournaments;
