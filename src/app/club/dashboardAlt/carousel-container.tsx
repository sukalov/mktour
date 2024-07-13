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
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

const CarouselContainer: FC<CarouselProps> = ({
  tabs,
  currentTab,
  setCurrentTab,
  setScrolling,
  selectedClub,
}) => {
  const [api, setApi] = useState<CarouselApi>();
  const tabsTitles = Object.keys(tabs);
  const indexOfTab = tabsTitles.findIndex((tab) => tab === currentTab);

  const handleSelect = useCallback(() => {
    if (!api) return;
    const num = api.selectedScrollSnap();
    setCurrentTab(tabsTitles[num]);
  }, [api, setCurrentTab]);

  useEffect(() => {
    if (!api) return;
    api.on('select', handleSelect);
    if (currentTab) api.scrollTo(indexOfTab);
  }, [api, currentTab, indexOfTab, handleSelect]);

  return (
    <Carousel setApi={setApi} opts={{ loop: true }}>
      <CarouselContent>
        {Object.entries(tabs).map(([title, component], i) => (
          <CarouselIteratee
            key={title}
            setScrolling={setScrolling}
            selectedClub={selectedClub}
            me={i}
            tab={indexOfTab}
          >
            {component}
          </CarouselIteratee>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

const CarouselIteratee: FC<{
  children: FC<{ selectedClub: string; isInView: boolean }>;
  setScrolling: Dispatch<SetStateAction<boolean>>;
  selectedClub: string;
  me: number;
  tab: number;
}> = ({ children: Component, setScrolling, selectedClub, tab, me }) => {
  const viewportRef = useRef<HTMLDivElement>(null);

  const isInView = me === tab;

  useEffect(() => {
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

  return (
    <CarouselItem>
      <ScrollArea viewportRef={viewportRef} className="mt-10 h-[85svh]">
        <Component selectedClub={selectedClub} isInView={isInView} />
      </ScrollArea>
    </CarouselItem>
  );
};

type CarouselProps = {
  tabs: Record<string, FC<{ selectedClub: string; isInView: boolean }>>;
  currentTab: string;
  setCurrentTab: (arg: string) => void;
  setScrolling: () => void;
  selectedClub: string;
};

export default CarouselContainer;
