import FinishTournamentButton from '@/app/tournaments/[id]/dashboard/finish-tournament-button';
import DeleteTournamentButton from '@/app/tournaments/[id]/dashboard/tabs/main/delete-tournament-button';
import ResetTournamentButton from '@/app/tournaments/[id]/dashboard/tabs/main/reset-tournament-button';
import StartTournamentButton from '@/app/tournaments/[id]/dashboard/tabs/main/start-tournament-button';
import { Status } from '@/lib/db/queries/get-status-in-tournament';
import { TournamentInfo } from '@/types/tournaments';
import { FC } from 'react';

const ActionButton: FC<{
  status: Status;
  tournament: TournamentInfo['tournament'];
}> = ({ status, tournament }) => {
  if (status !== 'organizer') return null;

  const { closed_at, rounds_number, ongoing_round } = tournament;

  if (closed_at) {
    return (
      <>
        <ResetTournamentButton />
        <DeleteTournamentButton />
      </>
    );
  }

  if (rounds_number === ongoing_round) {
    return (
      <>
        <FinishTournamentButton lastRoundNumber={rounds_number} />
        <ResetTournamentButton />
      </>
    );
  }

  return (
    <>
      <StartTournamentButton />
      <DeleteTournamentButton />
    </>
  );
};

export default ActionButton;
