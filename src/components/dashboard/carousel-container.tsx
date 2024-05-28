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
  useCallback,
} from 'react';

const CarouselContainer: FC<CarouselProps> = ({
  currentTab,
  setCurrentTab,
  setScrolling,
}) => {
  const [api, setApi] = useState<CarouselApi>();
  const indexOfTab = tabs.findIndex((tab) => tab.title === currentTab);

  const handleSelect = useCallback(() => {
    if (!api) return;
    const num = api.selectedScrollSnap();
    setCurrentTab(tabs[num].title);
  }, [api, setCurrentTab]);

  useEffect(() => {
    if (!api) return;
    api.on('select', handleSelect);
    if (currentTab) api.scrollTo(indexOfTab);
  }, [api, currentTab, indexOfTab, handleSelect]);

  return (
    <Carousel setApi={setApi} opts={{ loop: true }}>
      <CarouselContent>
        {tabs.map((tab) => (
          <CarouselIteratee
            key={tab.title}
            currentTab={currentTab}
            setScrolling={setScrolling}
          >
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
  setScrolling: Dispatch<SetStateAction<boolean>>;
}> = ({ children: Component, currentTab, setScrolling }) => {
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    handleScrollToTop(viewportRef);
  }, [currentTab]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      setScrolling(true);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setScrolling(false);
      }, 300);
    };

    viewportRef.current?.addEventListener('scroll', handleScroll);

    return () => {
      viewportRef.current?.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, [setScrolling]);

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
  setScrolling: Dispatch<SetStateAction<boolean>>;
};

export default CarouselContainer;
