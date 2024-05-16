import { tabs } from '@/components/dashboard/helpers/tabs';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { FC, useEffect, useState } from 'react';

const CarouselContainer: FC<any> = ({
  currentTab,
  setCurrentTab,
  setControlsTop,
  tournament
}) => {
  const [api, setApi] = useState<CarouselApi>();
  const indexOfTab = tabs.findIndex((tab) => tab.title === currentTab);

  useEffect(() => {
    if (!api) {
      return;
    }
    api
      .on('select', () => {
        let num = api.selectedScrollSnap();

        setCurrentTab(tabs[num].title);
      })
      .on('scroll', () => {
        if (currentTab === 'games') setControlsTop('top-[6rem]');
        else setControlsTop('top-0');
      });
    if (currentTab) api.scrollTo(indexOfTab);
  }, [api, currentTab, indexOfTab, setCurrentTab, tabs]);

  return (
    <Carousel setApi={setApi} opts={{ loop: true }}>
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
      <div className='mt-10'>
      <Component/>
      </div>
    </CarouselItem>
  );
};

export default CarouselContainer;
