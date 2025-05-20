import FinishTournamentButton from '@/app/tournaments/[id]/dashboard/finish-tournament-button';
import DeleteTournamentButton from '@/app/tournaments/[id]/dashboard/tabs/main/delete-tournament-button';
import ResetTournamentPButton from '@/app/tournaments/[id]/dashboard/tabs/main/reset-players-button';
import ResetTournamentButton from '@/app/tournaments/[id]/dashboard/tabs/main/reset-tournament-button';
import StartTournamentButton from '@/app/tournaments/[id]/dashboard/tabs/main/start-tournament-button';
import { Status } from '@/server/db/queries/get-status-in-tournament';
import { TournamentInfo } from '@/types/tournaments';
import { FC } from 'react';

const ActionButtonsRoot: FC<{
  status: Status;
  tournament: TournamentInfo['tournament'];
}> = ({ status, tournament }) => {
  if (status !== 'organizer') return null;

  const { closed_at, rounds_number, ongoing_round, started_at } = tournament;

  if (closed_at) {
    return (
      <>
        <ResetTournamentButton />
        <DeleteTournamentButton />
      </>
    );
  }

  if (started_at && rounds_number === ongoing_round) {
    return (
      <>
        <FinishTournamentButton lastRoundNumber={rounds_number} />
        <ResetTournamentButton />
      </>
    );
  }

  if (started_at) return <ResetTournamentButton />;

  return (
    <>
      <StartTournamentButton />
      <DeleteTournamentButton />
      <ResetTournamentPButton />
    </>
  );
};

const ActionButtons: FC<{
  status: Status;
  tournament: TournamentInfo['tournament'];
}> = (props) => (
  <div className="flex w-full flex-col gap-2 px-4">
    <ActionButtonsRoot {...props} />
  </div>
);

export default ActionButtons;
