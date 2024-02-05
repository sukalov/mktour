import Brackets from '@/app/test-dashboard/components/brackets';
import StyledCard from '@/app/test-dashboard/components/styled-card';
import TournamentTable from '@/app/test-dashboard/components/tournament-table';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { useEffect, useState } from 'react';

const CarouselContainer = ({
  currentTab,
  setCurrentTab,
  players,
  tabs,
  handleResult,
}: any) => {
  const [api, setApi] = useState<CarouselApi>();
  const currentIndex = tabs.indexOf(currentTab);

  useEffect(() => {
    if (!api) {
      return;
    }

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
          <Brackets handleResult={handleResult} />
        </CarouselItem>
      </CarouselContent>
    </Carousel>
  );
};

export default CarouselContainer;
