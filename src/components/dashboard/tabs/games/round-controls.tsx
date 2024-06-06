import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FC, PropsWithChildren } from 'react';

// FIXME any
const RoundControls: FC<any> = ({ props }) => {
  const { roundInView, games, setRoundInView, currentRound, currentTab } =
    props;
  const top = currentTab === 'games' ? 'top-0' : 'top-[-8rem]';

  const handleClick = (direction: string) => {
    const lastIndex = games.length - 1;
    let newRoundInView;
    if (direction === '<') {
      newRoundInView = roundInView === 0 ? lastIndex : roundInView - 1;
    } else if (direction === '>') {
      newRoundInView = roundInView === lastIndex ? 0 : roundInView + 1;
    }
    setRoundInView(newRoundInView);
  };

  const ControlButtonsProvider: FC<PropsWithChildren> = ({ children }) => {
    // if (games.length === 1) return children;
    return (
      <>
        <Button
          disabled={roundInView === 0}
          onClick={() => handleClick('<')}
          variant="ghost"
          size="sm"
          className="m-2"
        >
          <ChevronLeft />
        </Button>
        {children}
        <Button
          disabled={roundInView === currentRound - 1}
          onClick={() => handleClick('>')}
          variant="ghost"
          size="sm"
          className="m-2"
        >
          <ChevronRight />
        </Button>
      </>
    );
  };

  return (
    <div
      className={`absolute ${top} z-10 flex w-full items-center justify-between backdrop-blur-md transition-all duration-500`}
    >
      <ControlButtonsProvider>
        <div className="flex h-[52px] w-full flex-col items-center justify-center">
          <Button
            variant="ghost"
            size={'sm'}
            onClick={() => setRoundInView(currentRound - 1)}
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
      </ControlButtonsProvider>
    </div>
  );
};

export default RoundControls;
