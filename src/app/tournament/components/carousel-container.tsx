import Main from '@/app/tournament/(tabs)/main';
import TournamentTable from '@/app/tournament/(tabs)/table';
import StyledCard from '@/app/tournament/components/styled-card';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { useEffect, useState } from 'react';
import Brackets from '../(tabs)/brackets';

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
            <Main />
          </StyledCard>
        </CarouselItem>
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
