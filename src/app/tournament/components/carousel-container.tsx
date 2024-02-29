/* eslint-disable no-unused-vars */

import { TournamentContext } from '@/app/tournament/[id]/tournament-context';
import StyledCard from '@/app/tournament/components/styled-card';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { FC, useContext, useEffect, useState } from 'react';

const CarouselContainer: FC = () => {
  const [api, setApi] = useState<CarouselApi>();
  const { tabs, currentTab, setCurrentTab } = useContext(TournamentContext);
  const indexOfTab = tabs.findIndex((tab) => tab.title === currentTab);

  useEffect(() => {
    if (!api) {
      return;
    }
    api.on('select', () => {
      let num = api.selectedScrollSnap();
      setCurrentTab(tabs[num].title);
    });
    if (currentTab) api.scrollTo(indexOfTab);
  }, [api, currentTab, indexOfTab, setCurrentTab, tabs]);

  return (
    <Carousel setApi={setApi}>
      <CarouselContent>
        {tabs.map((tab) => (
          <CarouselIteratee key={tab.title}>{tab.component}</CarouselIteratee>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

const CarouselIteratee: FC<{ children: FC }> = ({ children: Component }) => {
  return (
    <CarouselItem>
      <StyledCard>
        <Component />
      </StyledCard>
    </CarouselItem>
  );
};

export default CarouselContainer;
