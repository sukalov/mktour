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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [roundInView]);

  return (
    <div>
      <div className="sticky top-[7rem] backdrop-blur-md z-40 mb-4 flex items-center justify-between">
        <RoundsControls props={{ api, roundInView, games, setRoundInView, currentRound }} />
      </div>
      <Carousel setApi={setApi} opts={{ startIndex: currentRound }}>
        <CarouselContent>
          {games.map((game, i) => (
            <CarouselItem key={i}>
              <div className="flex w-full flex-col justify-center gap-4 px-4">
                <RoundItem round={game} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

const RoundsControls: FC<any> = ({ props }) => {
  const { roundInView, games, setRoundInView, api, currentRound } = props;
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
    <div className="flex w-full px-4">
      <Button
        disabled={roundInView === 0}
        onClick={() => handleClick('left')}
        variant="ghost"
      >
        <ChevronLeft />
      </Button>
      <div className="flex w-full flex-col items-center">
        <Button variant="ghost" onClick={() => api?.scrollTo(currentRound)}>
          <span
            className={
              roundInView === currentRound ? 'underline underline-offset-4' : ''
            }
          >
            Round {roundInView + 1}
          </span>
        </Button>
      </div>
      <Button
        disabled={roundInView === games.length - 1}
        onClick={() => handleClick('right')}
        variant="ghost"
      >
        <ChevronRight />
      </Button>
    </div>
  );
};

export default RoundsCarousel;
