import {
  GameType,
  TournamentContext,
} from '@/app/tournament/[id]/tournament-context';
import RoundItem from '@/app/tournament/components/round-item';
import { FC, useContext } from 'react';

const RoundsContainer: FC = () => {
  const { games, currentRound } = useContext(TournamentContext);
  const preparedGames = games.slice(games.length - 6)
  return (
    <div className="flex justify-between px-4">
      {preparedGames.map((round: GameType[], roundIndex: number) => (
        <div className="flex flex-col justify-center text-center" key={roundIndex}>
          Round {roundIndex} {roundIndex === currentRound && '(current)'}
          <RoundItem key={roundIndex} round={round} />
        </div>
      ))}
    </div>
  );
};

export default RoundsContainer;
