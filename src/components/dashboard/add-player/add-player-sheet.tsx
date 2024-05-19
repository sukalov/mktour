import AddNewPlayer from '@/components/dashboard/add-player/add-new-player';
import AddPlayer from '@/components/dashboard/add-player/add-player';
import Fab from '@/components/dashboard/fab';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DatabasePlayerSlice } from '@/lib/hooks/use-tournament-store';
import { faker } from '@faker-js/faker';
import { FC, createElement, useState } from 'react';

const AddPlayerSheet = () => {
  const [value, setValue] = useState('');
  const [addingNewPlayer, setAddingNewPlayer] = useState(false);
  const handleClose = () => {
    setValue('');
    setAddingNewPlayer(false);
  };

  const content = createElement(addingNewPlayer ? AddNewPlayer : AddPlayer, {
    value,
    setAddingNewPlayer,
  });

  return (
    <Sheet>
      <SheetTrigger>
        <div>
          <Fab />
        </div>
      </SheetTrigger>
      <SheetContent
        onCloseAutoFocus={handleClose}
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="h-full w-[75vw] p-1"
      >
        <Input
          value={value}
          placeholder="search"
          onChange={(e) => setValue(e.target.value)}
        />
        <div className="mt-2">{content}</div>
      </SheetContent>
    </Sheet>
  );
};

export const PossiblePlayers: FC<PossiblePlayersProps> = ({
  players,
  addPlayer,
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

const getMockList = (n: number) =>
  Array(n)
    .fill('')
    .map((_, i) => <div key={i}>{i + '. ' + faker.person.fullName()}</div>);

export default AddPlayerSheet;
