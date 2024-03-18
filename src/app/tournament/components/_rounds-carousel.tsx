import {
  GameType,
  TournamentContext,
} from '@/app/tournament/[id]/tournament-context';
import RoundItem from '@/app/tournament/components/round-item';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
} from '@/components/ui/carousel';
import { FC, useContext, useEffect, useState } from 'react';

const RoundsCarousel: FC = () => {
  const { games, currentRound } = useContext(TournamentContext);
  const [roundInView, setRoundInView] = useState(currentRound);
  const [api, setApi] = useState<CarouselApi>();
  const handleClick = (direction: string) => {
    direction === 'left' ? api?.scrollPrev() : api?.scrollNext();
  };
  console.log(api?.slidesInView()[1]);
  useEffect(() => {
    api?.on('slidesInView', () => setRoundInView(api?.slidesInView()[1]));
  }, [api]);

  return (
    <div>
      <div className="sticky top-3 flex items-center justify-between">
        <Button onClick={() => handleClick('left')}>{'<'}</Button>
        Round {roundInView} {roundInView === currentRound && '(current)'}
        <Button onClick={() => handleClick('right')}>{'>'}</Button>
      </div>
      <Carousel setApi={setApi} opts={{ loop: true }}>
        <CarouselContent>
          {games.map((round: GameType[], roundIndex: number) => (
            <div key={roundIndex} className="flex flex-col items-center">
              <RoundItem round={round} />
            </div>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

// const CarouselIteratee: FC = () => {
//   return (
//     <>
//       Round {roundIndex} {roundIndex === currentRound && '(current)'}
//       <RoundItem key={roundIndex} round={round} />
//     </>
//   );
// };

export default RoundsCarousel;
