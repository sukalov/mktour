import { DashboardContext } from '@/app/tournament/[id]/dashboard-context';
import CarouselControls from '@/app/tournament/components/carousel-controls';
import RoundItem from '@/app/tournament/components/round-item';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { FC, useContext, useEffect, useState } from 'react';

const RoundsMobile: FC = () => {
  const { games, currentRound, top } = useContext(DashboardContext);
  const [roundInView, setRoundInView] = useState(currentRound);
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) {
      return;
    }
    api.on('select', () => {
      let num = api.selectedScrollSnap();
      setRoundInView(num);
    });
    if (roundInView) api.scrollTo(roundInView);
  }, [api, roundInView]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [roundInView]);

  const controlsTop = top === 'top-[3.5rem]' ? 'top-[7rem]' : 'top-[3.5rem]';

  return (
    <div>
      <div
        className={`sticky z-40 w-full ${controlsTop} flex items-center justify-between backdrop-blur-md transition-all duration-500`}
      >
        <CarouselControls
          props={{ api, roundInView, games, setRoundInView, currentRound }}
        />
      </div>
      <Carousel
        setApi={setApi}
        opts={{ startIndex: currentRound || undefined }}
      >
        <CarouselContent>
          {games.map((round, i) => (
            <CarouselItem key={i}>
              <div className="flex w-full flex-col justify-center gap-4 px-4">
                <RoundItem round={round} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default RoundsMobile;
