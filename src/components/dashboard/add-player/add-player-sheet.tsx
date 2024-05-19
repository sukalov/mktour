import AddNewPlayer from '@/components/dashboard/add-player/add-new-player';
import AddPlayer from '@/components/dashboard/add-player/add-player';
import { DashboardContext } from '@/components/dashboard/dashboard-context';
import Fab from '@/components/dashboard/fab';
import { onClickAddExistingPlayer, onClickAddNewPlayer } from '@/components/dashboard/helpers/on-click-handlers';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { faker } from '@faker-js/faker';
import { createElement, useContext, useState } from 'react';

const AddPlayerSheet = () => {
  const [value, setValue] = useState('');
  const [addingNewPlayer, setAddingNewPlayer] = useState(false);
  const { sendJsonMessage } = useContext(DashboardContext)
  const handleClose = () => {
    setValue('');
    setAddingNewPlayer(false);
  };

  const handleAddPlayer = (id: string) => {
    addingNewPlayer 
      ? onClickAddNewPlayer(sendJsonMessage)
      : onClickAddExistingPlayer(id, sendJsonMessage)
    handleClose()
  }

  const content = createElement(addingNewPlayer ? AddNewPlayer : AddPlayer, {
    value,
    setAddingNewPlayer,
    handleAddPlayer
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

const getMockList = (n: number) =>
  Array(n)
    .fill('')
    .map((_, i) => <div key={i}>{i + '. ' + faker.person.fullName()}</div>);

export default AddPlayerSheet;
