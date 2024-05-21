import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FC, PropsWithChildren } from 'react';

// FIXME any
const RoundControls: FC<any> = ({ props }) => {
  const { roundInView, games, setRoundInView, currentRound, currentTab } =
    props;
  const top = currentTab === 'games' ? 'top-10' : 'top-0';

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

  const ControlButtons: FC<PropsWithChildren> = ({ children }) => {
    if (
      games.length === 1 ||
      roundInView === 0 ||
      roundInView === games.length - 1
    )
      return children;
    return (
      <>
        <Button
          disabled={roundInView === 0 || games.length === 1}
          onClick={() => handleClick('<')}
          variant="ghost"
          size="sm"
          className="m-2"
        >
          <ChevronLeft />
        </Button>
        {children}
        <Button
          disabled={roundInView === games.length - 1}
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
      className={`fixed ${top} z-10 flex w-full items-center justify-between backdrop-blur-md transition-all duration-500`}
    >
      <ControlButtons>
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
      </ControlButtons>
    </div>
  );
};

export default RoundControls;
