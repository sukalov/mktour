import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FC } from 'react';

const CarouselControls: FC<any> = ({ props }) => {
  const { roundInView, games, setRoundInView, api, currentRound } = props;
  const handleClick = (direction: string) => {
    if (direction === 'left') {
      if (roundInView === 0) {
        setRoundInView(games.length - 1);
      } else {
        setRoundInView(roundInView - 1);
      }
    } else {
      if (roundInView === games.length - 1) {
        setRoundInView(0);
      } else {
        setRoundInView(roundInView + 1);
      }
    }
  };
  return (
      <div className="flex w-full px-4">
        <Button
          disabled={roundInView === 0}
          onClick={() => handleClick('left')}
          variant="ghost"
          size="sm"
          className="m-2"
        >
          <ChevronLeft />
        </Button>
        <div className="flex w-full flex-col items-center justify-center">
          <Button
            variant="ghost"
            size={'sm'}
            onClick={() => api?.scrollTo(currentRound)}
          >
            <span
              className={
                roundInView === currentRound
                  ? 'underline underline-offset-4'
                  : ''
              }
            >
              Round {roundInView + 1}
            </span>
          </Button>
        </div>
        <Button
          disabled={roundInView === games.length - 1}
          onClick={() => handleClick('right')}
          variant="ghost"
          size="sm"
          className="m-2"
        >
          <ChevronRight />
        </Button>
      </div>
  );
};

export default CarouselControls;
