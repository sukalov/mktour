import { Button, ButtonProps } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FC, PropsWithChildren } from 'react';

// FIXME any
const RoundControls: FC<any> = ({
  props: { currentRound, roundInView, games, setRoundInView, currentTab },
}) => {
  const top = currentTab === 'games' ? 'top-0' : 'top-[-4rem]';

  const handleClick = (direction: string) => {
    const lastIndex = games.length - 1;
    let newRoundInView;
    if (direction === '<') {
      newRoundInView = roundInView === 1 ? lastIndex : roundInView - 1;
    } else if (direction === '>') {
      newRoundInView = roundInView === lastIndex ? 1 : roundInView + 1;
    }
    setRoundInView(newRoundInView);
  };

  const ControlsProvider: FC<PropsWithChildren> = ({ children }) => {
    if (games.length === 1) return children;
    return (
      <>
        <Button
          style={{ visibility: roundInView === 1 ? 'hidden' : 'visible' }}
          onClick={() => handleClick('<')}
          {...buttonProps}
        >
          <ChevronLeft />
        </Button>
        {children}
        <Button
          style={{
            visibility: roundInView === currentRound - 1 ? 'hidden' : 'visible',
          }}
          onClick={() => handleClick('>')}
          {...buttonProps}
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
      <ControlsProvider>
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
              Round {roundInView}
            </span>
          </Button>
        </div>
      </ControlsProvider>
    </div>
  );
};

const buttonProps: ButtonProps = {
  variant: 'ghost',
  size: 'sm',
  className: 'm-2',
};

export default RoundControls;
