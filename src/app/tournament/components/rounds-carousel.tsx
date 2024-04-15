import { TournamentContext } from '@/app/tournament/[id]/tournament-context';
import CarouselControls from '@/app/tournament/components/carousel-controls';
import RoundItem from '@/app/tournament/components/round-item';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { FC, useContext, useEffect, useState } from 'react';

const RoundsCarousel: FC = () => {
  const { games, currentRound } = useContext(TournamentContext);
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

  return (
    <div>
      <div className="fixed w-full top-[7rem] z-40 flex items-center justify-between backdrop-blur-md">
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
              <div className="flex w-full mt-14 flex-col justify-center gap-4 px-4">
                <RoundItem round={round} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};
       
export default RoundsCarousel;
