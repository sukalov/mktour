import { TournamentContext } from '@/app/tournament/[id]/tournament-context';
import CurrentRound from '@/app/tournament/components/current-round';
import { FC, useContext } from 'react';

const Games: FC = () => {
  const { games, currentRound } = useContext(TournamentContext);
  return (
    <>
      <CurrentRound games={games} currentRound={currentRound} />
    </>
  );
};
export default Games;
