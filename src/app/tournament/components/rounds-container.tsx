import {
  GameType,
  TournamentContext,
} from '@/app/tournament/[id]/tournament-context';
import RoundItem from '@/app/tournament/components/round-item';
import { FC, useContext } from 'react';

const RoundsContainer: FC = () => {
  const { games, currentRound } = useContext(TournamentContext);
  return (
    <div className="flex overflow-scroll">
      {games.map((round: GameType[], roundIndex: number) => (
        <div className="flex flex-col justify-center" key={roundIndex}>
          Round {roundIndex} {roundIndex === currentRound && '(current)'}
          <RoundItem key={roundIndex} round={round} />
        </div>
      ))}
    </div>
  );
};

export default RoundsContainer;
