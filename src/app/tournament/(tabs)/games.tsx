import {
  GameType,
  TournamentContext,
} from '@/app/tournament/[id]/tournament-context';
import RoundItem from '@/app/tournament/components/round-item';
import RoundsCarousel from '@/app/tournament/components/rounds-carousel';
import { FC, useContext, useRef } from 'react';
import { useMediaQuery } from 'react-responsive';

const Games: FC = () => {
  const { games, currentRound } = useContext(TournamentContext);
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const ref = useRef<any>(null);

  // useEffect(() => {
  //   if (currentTab === 'games') {
  //     ref.current.children[currentRound].scrollIntoView({
  //       behavior: 'smooth',
  //       inline: 'center',
  //       block: 'start',
  //     });
  //   }
  // }, [currentRound, currentTab]);

  if (isMobile) return <RoundsCarousel />;

  return (
    <div
      ref={ref}
      className="scrollbar-hide flex justify-between gap-8 overflow-scroll px-4"
    >
      {games.map((round: GameType[], roundIndex: number) => (
        <div
          className="flex flex-col justify-center gap-4 text-center"
          key={roundIndex}
        >
          Round {roundIndex}
          {roundIndex === currentRound && '(current)'}
          <RoundItem key={roundIndex} round={round} />
        </div>
      ))}
    </div>
  );
};

export default Games;
