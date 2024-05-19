import { Button } from '@/components/ui/button';
import { SheetHeader } from '@/components/ui/sheet';
import {
  DatabasePlayerSlice,
  useTournamentStore,
} from '@/lib/hooks/use-tournament-store';
import { Plus } from 'lucide-react';
import { Dispatch, FC, SetStateAction } from 'react';

const AddPlayer: FC<PlayerProps> = ({ value, setAddingNewPlayer, handleAddPlayer }) => {
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
        <PossiblePlayers players={filteredPlayers} addPlayer={handleAddPlayer} />
        {/* {getMockList(50)} */}
      </div>
    </>
  );
};

const PossiblePlayers: FC<PossiblePlayersProps> = ({
  players,
  addPlayer
}) => {

  return players.map((player) => (
    <div
      className="flex w-full justify-between"
      onClick={() => addPlayer(player.id)}
    >
      <span>{player.nickname}</span>
      <span className="text-muted">{player.rating}</span>
    </div>
  ));
};

type PossiblePlayersProps = {
  players: DatabasePlayerSlice[];
  addPlayer: (id: string) => void;
};


export type PlayerProps = {
  value: string;
  setAddingNewPlayer: Dispatch<SetStateAction<boolean>>;
  handleAddPlayer: (id: string) => void;
};

export default AddPlayer;
