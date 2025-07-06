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
            setScrolling={setScrolling}
            key={tab.title}
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
  currentTab: string;
  setScrolling?: Dispatch<SetStateAction<boolean>>;
}> = ({ children: Component, currentTab, setScrolling }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentTab) {
      ref.current?.scrollTo({ top: 0 });
    }
  }, [currentTab, ref]);

  useEffect(() => {
    if (!setScrolling) return;

    let timeoutId: NodeJS.Timeout;
    const node = ref.current;

    const handleScroll = () => {
      setScrolling(true);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setScrolling(false), 300);
    };

    node?.addEventListener('scroll', handleScroll);

    return () => {
      node?.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, [setScrolling]);

  return (
    <CarouselItem>
      <RemoveScroll
        noIsolation
        ref={ref}
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
