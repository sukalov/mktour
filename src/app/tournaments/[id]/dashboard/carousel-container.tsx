import { DashboardContextType } from '@/app/tournaments/[id]/dashboard/dashboard-context';
import tabs from '@/app/tournaments/[id]/dashboard/tabs';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { RemoveScroll } from 'react-remove-scroll';

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
    <Carousel setApi={setApi} opts={{ loop: false }}>
      <CarouselContent>
        {tabs.map((tab) => (
          <CarouselIteratee
            key={tab.title}
            setScrolling={setScrolling}
            currentTab={currentTab}
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
  setScrolling: Dispatch<SetStateAction<boolean>>;
  currentTab: string;
}> = ({ children: Component, setScrolling, currentTab }) => {
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // NB: this hook controls FAB opacity when scrolling
    let timeoutId: NodeJS.Timeout;
    const viewportRefCopy = viewportRef.current;

    const handleScroll = () => {
      setScrolling(true);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setScrolling(false);
      }, 300);
    };

    viewportRefCopy?.addEventListener('scroll', handleScroll);

    return () => {
      viewportRefCopy?.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, [setScrolling]);

  useEffect(() => {
    if (currentTab) {
      viewportRef.current?.scrollTo({ top: 0 });
    }
  }, [currentTab]);

  return (
    <CarouselItem>
      <RemoveScroll
        noIsolation
        ref={viewportRef}
        className="h-dvh overflow-scroll pb-20"
      >
        <Component />
      </RemoveScroll>
    </CarouselItem>
  );
};

type CarouselProps = {
  currentTab: DashboardContextType['currentTab'];
  setCurrentTab: Dispatch<SetStateAction<DashboardContextType['currentTab']>>;
  setScrolling: Dispatch<SetStateAction<boolean>>;
};

export default CarouselContainer;
