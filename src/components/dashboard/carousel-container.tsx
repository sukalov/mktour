import { DashboardContextType } from '@/components/dashboard/dashboard-context';
import tabs from '@/components/dashboard/tabs';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dispatch,
  FC,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';

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
          <CarouselIteratee key={tab.title} currentTab={currentTab}>
            {tab.component}
          </CarouselIteratee>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

const CarouselIteratee: FC<{
  children: FC;
  currentTab: CarouselProps['currentTab'];
}> = ({ children: Component, currentTab }) => {
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    handleScrollToTop(viewportRef);
  }, [currentTab]);

  return (
    <CarouselItem>
      <ScrollArea viewportRef={viewportRef} className="mt-10 h-[85svh]">
        <Component />
      </ScrollArea>
    </CarouselItem>
  );
};

const handleScrollToTop = (viewportRef: RefObject<HTMLDivElement>) => {
  if (viewportRef.current !== null)
    viewportRef.current.scrollTo({ top: 0, behavior: 'smooth' });
};

type CarouselProps = {
  currentTab: SetStateAction<DashboardContextType['currentTab']>;
  setCurrentTab: Dispatch<SetStateAction<DashboardContextType['currentTab']>>;
};

export default CarouselContainer;
