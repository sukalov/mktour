import {
  GameType,
  TournamentContext,
} from '@/app/tournament/[id]/tournament-context';
import RoundItem from '@/app/tournament/components/round-item';
import RoundsCarousel from '@/app/tournament/components/rounds-carousel';
import { FC, useContext } from 'react';
import { useMediaQuery } from 'react-responsive';

const RoundsContainer: FC = () => {
  const { games, currentRound } = useContext(TournamentContext);
  const preparedGames = games.slice(games.length - 6)
  const isMobile = useMediaQuery({ maxWidth: 1224 })
  
  if (isMobile) return <RoundsCarousel/>

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
