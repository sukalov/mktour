import {
  DashboardContext,
  DashboardContextType,
} from '@/app/tournaments/[id]/dashboard/dashboard-context';
import tabs from '@/app/tournaments/[id]/dashboard/tabs';
import Overlay from '@/components/overlay';
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
  useContext,
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
  const { overlayed } = useContext(DashboardContext); // TODO pass props from parent

  useEffect(() => {
    overlayed && api?.reInit();
  }, [api, api?.reInit, overlayed]); // FIXME kinda wrong, should not rely on Overlay state

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
  const { overlayed } = useContext(DashboardContext);

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
        className="mt-10 h-[calc(100dvh-5rem)] overflow-scroll pb-16 small-scrollbar"
      >
        <Overlay open={overlayed} />
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
