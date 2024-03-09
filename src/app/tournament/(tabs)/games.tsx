import RoundsContainer from '@/app/tournament/components/rounds-container';
import { FC } from 'react';

const Games: FC = () => {
  // const { games, currentRound } = useContext(TournamentContext);
  return (
    <>
      {/* <RoundItem games={games} currentRound={currentRound} /> */}
      <RoundsContainer />
    </>
  );
};
export default Games;
