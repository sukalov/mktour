import StyledCard from '@/app/test-dashboard/components/styled-card';
import TournamentTable from '@/app/test-dashboard/components/tournament-table';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { useEffect, useState } from 'react';
import Brackets from './brackets';

const CarouselContainer = ({
  currentTab,
  setCurrentTab,
  players,
  tabs,
  handleResult,
}: any) => {
  const [api, setApi] = useState<CarouselApi>();
  const currentIndex = tabs.indexOf(currentTab);
  const [active, setActive] = useState(true);
  console.log(active);
  console.log(currentIndex, currentTab);

  useEffect(() => {
    if (!api) {
      return;
    }
    // !active && api?.reInit({ active: false });
    // active && api?.reInit({ active: true });
    api.on('select', () => {
      let num = api.selectedScrollSnap();
      setCurrentTab(tabs[num]);
    });
    if (currentTab) api.scrollTo(currentIndex);
  }, [api, currentIndex, currentTab, setCurrentTab, tabs]);

  return (
    <Carousel setApi={setApi}>
      <CarouselContent>
        <CarouselItem>
          <StyledCard>
            <TournamentTable players={players} />
          </StyledCard>
        </CarouselItem>
        <CarouselItem>
          <Brackets handleResult={handleResult} setActive={setActive} />
        </CarouselItem>
      </CarouselContent>
    </Carousel>
  );
};

export default CarouselContainer;
