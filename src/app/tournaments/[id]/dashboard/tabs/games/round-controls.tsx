import { Button, ButtonProps } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Dispatch, FC, PropsWithChildren, SetStateAction } from 'react';

const RoundControls: FC<RoundControlProps> = ({
  currentRound,
  roundInView,
  setRoundInView,
  currentTab,
}) => {
  const t = useTranslations('Tournament.Round');
  const top = currentTab === 'games' ? 'top-10' : 'top-0';

  const handleClick = (direction: string) => {
    let newRoundInView = roundInView;
    if (direction === '<') {
      newRoundInView = roundInView - 1;
    } else if (direction === '>') {
      newRoundInView = roundInView + 1;
    }
    setRoundInView(newRoundInView);
  };

  const ControlsProvider: FC<PropsWithChildren> = ({ children }) => {
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
            visibility: roundInView === currentRound ? 'hidden' : 'visible',
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
      className={`absolute ${top} z-10 flex h-12 w-[100vw] items-center justify-between backdrop-blur-md transition-all duration-500`}
    >
      <ControlsProvider>
        <div className="flex h-full w-full flex-col items-center justify-center">
          <Button
            variant="ghost"
            size={'sm'}
            onClick={() => setRoundInView(currentRound)}
          >
            <span
              className={
                roundInView === currentRound
                  ? 'underline underline-offset-4'
                  : ''
              }
            >
              {t('round', { roundInView })}
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
  className: 'my-2 mx-4',
};

interface RoundControlProps {
  currentRound: number;
  roundInView: number;
  setRoundInView: Dispatch<SetStateAction<number>>;
  currentTab: 'main' | 'games' | 'table';
}

export default RoundControls;
