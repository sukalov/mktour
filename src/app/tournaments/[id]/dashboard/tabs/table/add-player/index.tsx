
import Fab from '@/app/tournaments/[id]/dashboard/fab';
import AddNewPlayer from '@/app/tournaments/[id]/dashboard/tabs/table/add-player/add-new-player';
import AddPlayer from '@/app/tournaments/[id]/dashboard/tabs/table/add-player/add-player';
import FabClose from '@/app/tournaments/[id]/dashboard/tabs/table/add-player/fab-close';
import { Button } from '@/components/ui/button';
import { DatabasePlayer } from '@/lib/db/schema/tournaments';
import { ArrowLeft, Plus, UserPlus } from 'lucide-react';
import { Dispatch, SetStateAction, useState } from 'react';
import { Drawer } from 'vaul';

const AddPlayerDrawer = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [addingNewPlayer, setAddingNewPlayer] = useState(false);

  const handleClose = () => {
    setOpen(false);
    setAddingNewPlayer(false);
    setValue('');
  };

  const returnToNewPlayer = (player: DatabasePlayer) => {
    setOpen(true);
    setAddingNewPlayer(true);
    setValue(player.nickname);
  };

  return (
    <Drawer.Root
      shouldScaleBackground
      direction="right"
      preventScrollRestoration={false}
      onClose={handleClose}
      open={open}
    >
      <Drawer.Trigger asChild>
        <div>
          <Fab
            onClick={() => {
              setOpen(true);
            }}
            icon={UserPlus}
          />
        </div>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 top-0 bg-black/80" />
        <Drawer.Content className="fixed bottom-0 left-4 right-0 top-0 z-50 flex flex-col outline-none">
          <div className="flex flex-1 flex-col gap-3 rounded-l-[10px] border border-secondary bg-background px-6 pt-8">
            <Button
              size="sm"
              className="flex w-full gap-2"
              onClick={() => setAddingNewPlayer((prev) => !prev)}
              variant={addingNewPlayer ? 'outline' : 'default'}
            >
              {!addingNewPlayer ? <Plus /> : <ArrowLeft />}
              {!addingNewPlayer ? 'add new player' : 'back'}
            </Button>
            <div className="absolute h-1 w-full shadow-red-600 drop-shadow-2xl"></div>
            {addingNewPlayer ? (
              <AddNewPlayer
                setOpen={setOpen}
                value={value}
                setValue={setValue}
                returnToNewPlayer={returnToNewPlayer}
              />
            ) : (
              <AddPlayer setOpen={setOpen} value={value} setValue={setValue} />
            )}
          </div>
          <FabClose
            onClick={() => {
              setOpen(false);
            }}
          />
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export type DrawerProps = {
  setOpen: (_arg0: boolean) => void;
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
};

export type HandlerProps =
  | {
      type: 'existing';
      id: string;
    }
  | {
      type: 'new';
      name: string;
      rating: number;
    };

export default AddPlayerDrawer;
