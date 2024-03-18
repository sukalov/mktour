import { TournamentContext } from '@/app/tournament/[id]/tournament-context';
import RoundItem from '@/app/tournament/components/round-item';
import { Button } from '@/components/ui/button';
import { FC, useContext, useState } from 'react';

const RoundsCarousel: FC = () => {
  const { games, currentRound } = useContext(TournamentContext);
  const [roundInView, setRoundInView] = useState(currentRound);

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
      <div className="sticky top-3 flex items-center justify-between">
        <Button onClick={() => handleClick('left')}>{'<'}</Button>
        Round {roundInView} {roundInView === currentRound && '(current)'}
        <Button onClick={() => handleClick('right')}>{'>'}</Button>
      </div>
      <div className="flex flex-col items-center">
        <RoundItem round={games[roundInView]} />
      </div>
    </div>
  );
};

export default RoundsCarousel;
