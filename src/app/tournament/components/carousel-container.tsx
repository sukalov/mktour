import Main from '@/app/tournament/(tabs)/main';
import MockSlot from '@/app/tournament/(tabs)/mock-slot';
import MockSlotWithLongTitle from '@/app/tournament/(tabs)/mock-slot-with-long-title';
import TournamentTable from '@/app/tournament/(tabs)/table';

import { TournamentContext } from '@/app/tournament/[id]/tournament-context';
import StyledCard from '@/app/tournament/components/styled-card';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { FC, useContext, useEffect, useState } from 'react';
import Brackets from '../(tabs)/brackets';

const CarouselContainer: FC = () => {
  const [api, setApi] = useState<CarouselApi>();
  const { tabs, currentTab, setCurrentTab } = useContext(TournamentContext);
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
            <Main />
          </StyledCard>
        </CarouselItem>
        <CarouselItem>
          <StyledCard>
            <TournamentTable />
          </StyledCard>
        </CarouselItem>
        <CarouselItem>
          <Brackets />
        </CarouselItem>
        <CarouselItem>
          <MockSlotWithLongTitle />
        </CarouselItem>
        <CarouselItem>
          <MockSlot />
        </CarouselItem>
      </CarouselContent>
    </Carousel>
  );
};

export default CarouselContainer;
