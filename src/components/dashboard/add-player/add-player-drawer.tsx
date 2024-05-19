import Fab from '@/components/dashboard/fab';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import {
  DatabasePlayerSlice,
  useTournamentStore,
} from '@/lib/hooks/use-tournament-store';
import { faker } from '@faker-js/faker';
import { FC, useState } from 'react';

const AddPlayerDrawer = () => {
  const [value, setValue] = useState('');
  const { possiblePlayers, addPlayer, addNewPlayer } = useTournamentStore();
  const filteredPlayers = possiblePlayers.filter(
    (player: DatabasePlayerSlice) => {
      const regex = new RegExp(value, 'i');
      if (value === '') return player;
      return regex.test(player.nickname);
    },
  );

  return (
    <Drawer
      preventScrollRestoration={true}
      disablePreventScroll={true}
      onClose={() => {
        setValue('');
      }}
      direction="right"
    >
      <DrawerTrigger asChild>
        <div>
          <Fab />
        </div>
      </DrawerTrigger>
      <DrawerContent className="mx-auto h-[75vh] w-full max-w-sm">
        <DrawerHeader>
          <Input
            value={value}
            placeholder="Search"
            onChange={(e) => setValue(e.target.value)}
          />
        </DrawerHeader>
        <div className="flex w-full flex-col items-start justify-center gap-2 overflow-y-scroll p-4">
          <PossiblePlayers players={filteredPlayers} addPlayer={addPlayer} />
          {/* <MockList /> */}
        </div>
        <DrawerFooter className="flex w-full flex-col items-center justify-center">
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

const PossiblePlayers: FC<PossiblePlayersProps> = ({ players, addPlayer }) => {
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

const MockList = () =>
  Array(50)
    .fill('')
    .map((_, i) => <div key={i}>{i + ' ' + faker.person.fullName()}</div>);

export default AddPlayerDrawer;
