import { PossiblePlayers } from '@/components/dashboard/add-player/add-player-sheet';
import { Button } from '@/components/ui/button';
import { SheetHeader } from '@/components/ui/sheet';
import {
  DatabasePlayerSlice,
  useTournamentStore,
} from '@/lib/hooks/use-tournament-store';
import { Plus } from 'lucide-react';
import { Dispatch, FC, SetStateAction } from 'react';

const AddPlayer: FC<PlayerProps> = ({
  value,
  setAddingNewPlayer,
}) => {
  const { possiblePlayers, addPlayer } = useTournamentStore();
  const filteredPlayers = possiblePlayers.filter(
    (player: DatabasePlayerSlice) => {
      const regex = new RegExp(value, 'i');
      if (value === '') return player;
      return regex.test(player.nickname);
    },
  );
  return (
    <>
      <SheetHeader>
        <Button
          disabled={!value}
          size={'sm'}
          className="flex w-full gap-2 text-muted shadow-current drop-shadow-md"
          variant={'outline'}
          onClick={() => setAddingNewPlayer(true)}
        >
          <Plus /> add new player
        </Button>
      </SheetHeader>
      <div className="scrollbar-hide flex h-full w-full flex-col items-start gap-2 overflow-y-scroll p-4 pt-4">
        <PossiblePlayers players={filteredPlayers} addPlayer={addPlayer} />
        {/* {getMockList(50)} */}
      </div>
    </>
  );
};

export type PlayerProps = {
  value: string;
  setAddingNewPlayer: Dispatch<SetStateAction<boolean>>;
};

export default AddPlayer;
