import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { FC } from 'react';

const Player: FC<PlayerProps> = ({
  handleMutate,
  isWinner,
  nickname,
  selected,
  position,
}) => {
  return (
    <AnimatePresence>
      <motion.div
        className="h-full"
        animate={{
          x: selected ? (position.text === 'text-left' ? '10%' : '-10%') : 0,
        }}
        transition={{ duration: 0.25, ease: 'linear' }}
      >
        <Button
          variant="ghost"
          className={cn(
            `line-clamp-2 h-full w-full max-w-full ${position.text} rounded-sm p-1 px-2 break-words text-ellipsis hyphens-auto select-none ${selected && isWinner && 'underline underline-offset-4'}`,
          )}
          onClick={handleMutate}
        >
          <small className={``}>{nickname}</small>
        </Button>
      </motion.div>
    </AnimatePresence>
  );
};

type PlayerProps = {
  handleMutate?: () => void;
  nickname: string | null;
  isWinner: boolean;
  selected: boolean;
  muted?: boolean;
  position: {
    justify: 'justify-self-start' | 'justify-self-end';
    text: 'text-left' | 'text-right';
  };
};

export default Player;
