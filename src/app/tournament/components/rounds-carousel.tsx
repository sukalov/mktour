import { TournamentContext } from '@/app/tournament/[id]/tournament-context';
import RoundItem from '@/app/tournament/components/round-item';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FC, useContext, useEffect, useState } from 'react';

const RoundsCarousel: FC = () => {
  const { games, currentRound } = useContext(TournamentContext);
  const [roundInView, setRoundInView] = useState(currentRound);
  const [api, setApi] = useState<CarouselApi>();
  const { tabs, currentTab, setCurrentTab } = useContext(TournamentContext);

  useEffect(() => {
    if (!api) {
      return;
    }
    api.on('select', () => {
      let num = api.selectedScrollSnap();
      setRoundInView(num);
    });
    if (roundInView) api.scrollTo(roundInView);
  }, [api, currentTab, roundInView, setCurrentTab, tabs]);

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
          <Button variant="ghost" onClick={() => api?.scrollTo(currentRound)}>
            <span className={roundInView === currentRound ? 'underline' : ''}>Round {roundInView}</span>
          </Button>
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
      <Carousel setApi={setApi}>
        <CarouselContent>
          {/* <div className='w-full flex flex-col gap-4 justify-center'> */}
          {games.map((game, i) => (
            <CarouselItem key={i}>
              <RoundItem round={game} />
            </CarouselItem>
          ))}
          {/* </div> */}
        </CarouselContent>
      </Carousel>
    </div>
  );  
};

export default RoundsCarousel;
