import { DashboardContextType } from '@/components/dashboard/dashboard-context';
import tabs from '@/components/dashboard/tabs';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';

const CarouselContainer: FC<CarouselProps> = ({
  currentTab,
  setCurrentTab,
}) => {
  const [api, setApi] = useState<CarouselApi>();
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
      <ScrollArea className="mt-10 h-[85svh]">
        <Component />
      </ScrollArea>
    </CarouselItem>
  );
};

type CarouselProps = {
  currentTab: SetStateAction<DashboardContextType['currentTab']>;
  setCurrentTab: Dispatch<SetStateAction<DashboardContextType['currentTab']>>;
};

export default CarouselContainer;
