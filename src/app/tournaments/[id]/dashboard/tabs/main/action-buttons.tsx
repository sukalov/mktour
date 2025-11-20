import FinishTournamentButton from '@/app/tournaments/[id]/dashboard/finish-tournament-button';
import DeleteTournamentButton from '@/app/tournaments/[id]/dashboard/tabs/main/delete-tournament-button';
import ResetTournamentPButton from '@/app/tournaments/[id]/dashboard/tabs/main/reset-players-button';
import ResetTournamentButton from '@/app/tournaments/[id]/dashboard/tabs/main/reset-tournament-button';
import StartTournamentButton from '@/app/tournaments/[id]/dashboard/tabs/main/start-tournament-button';
import { TournamentInfo } from '@/server/db/zod/tournaments';
import { Status } from '@/server/queries/get-status-in-tournament';
import { FC } from 'react';

const ActionButtonsRoot: FC<{
  status: Status;
  tournament: TournamentInfo['tournament'];
}> = ({ status, tournament }) => {
  if (status !== 'organizer') return null;

  const { closedAt, roundsNumber, ongoingRound, startedAt } = tournament;

  if (closedAt) {
    return (
      <>
        <ResetTournamentButton />
        <DeleteTournamentButton />
      </>
    );
  }

  if (startedAt && roundsNumber === ongoingRound) {
    return (
      <>
        <FinishTournamentButton lastRoundNumber={roundsNumber} />
        <ResetTournamentButton />
      </>
    );
  }

  if (startedAt) return <ResetTournamentButton />;

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
  <div className="flex w-full flex-col gap-2 p-2">
    <ActionButtonsRoot {...props} />
  </div>
);

export default ActionButtons;
