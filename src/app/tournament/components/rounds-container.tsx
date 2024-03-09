import {
  GameType,
  TournamentContext,
} from '@/app/tournament/[id]/tournament-context';
import RoundItem from '@/app/tournament/components/round-item';
import { FC, useContext } from 'react';

const RoundsContainer: FC = () => {
  const { games } = useContext(TournamentContext);
  console.log(games);
  return (
    <div className='flex overflow-scroll'>
      {games.map((round: GameType[], roundIndex: number) => (
        <div key={roundIndex}>
          {roundIndex}
          <RoundItem key={roundIndex} round={round} />
        </div>
      ))}
    </div>
  );
};

export default RoundsContainer;
