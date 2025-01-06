import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FC } from "react";

const Player: FC<PlayerProps> = ({
  handleMutate,
  isWinner,
  nickname,
  selected,
  muted,
  position,
}) => {
  return (
    <Button
      variant="ghost"
      className={cn(
        `${!selected ? `pointer-events-none ${position.justify}` : 'justify-center'} line-clamp-2 h-full w-full max-w-full rounded-sm p-1 px-2 break-words text-ellipsis hyphens-auto select-none ${muted ? 'text-muted-foreground' : selected && isWinner && 'underline underline-offset-4'}`,
      )}
      onClick={handleMutate}
    >
      <small
        className={`line-clamp-2 ${!selected ? `pointer-events-none ${position.text}` : 'text-center'} `}
      >
        {nickname}
      </small>
    </Button>
  );
};

type PlayerProps = {
  handleMutate: () => void;
  nickname: string | null;
  isWinner: boolean;
  selected: boolean;
  muted?: boolean;
  position: {
    justify: 'justify-self-start' | 'justify-self-end';
    text: 'text-left' | 'text-right';
  };
};

export default Player