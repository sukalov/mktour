import { TournamentContext } from '@/app/tournament/[id]/tournament-context';
import RoundItem from '@/app/tournament/components/round-item';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FC, useContext, useState } from 'react';

const RoundsCarousel: FC = () => {
  const { games, currentRound } = useContext(TournamentContext);
  const [roundInView, setRoundInView] = useState(currentRound);
  const round = games[roundInView];

  const handleClick = (direction: string) => {
    if (direction === 'left') {
      if (roundInView === 0) {
        setRoundInView(games.length - 1);
      } else {
        setRoundInView(roundInView - 1);
      }
    } else {
      if (roundInView === games.length - 1) {
        setRoundInView(0);
      } else {
        setRoundInView(roundInView + 1);
      }
    }
  };
  return (
    <div>
      <div className="sticky top-2 mb-4 flex items-center justify-between">
        <Button
          disabled={roundInView === 0}
          onClick={() => handleClick('left')}
          variant="ghost"
        >
          <ChevronLeft />
        </Button>
        <div className="flex w-full flex-col items-center">
          <span>Round {roundInView}</span>
          <span>{roundInView === currentRound && '(current)'}</span>
        </div>
        <Button
          disabled={roundInView === games.length - 1}
          onClick={() => handleClick('right')}
          variant="ghost"
        >
          <ChevronRight />
        </Button>
      </div>
      <div className="flex flex-col items-center gap-4">
        <RoundItem round={round} />
      </div>
    </div>
  );
};

export default RoundsCarousel;
