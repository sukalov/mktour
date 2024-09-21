import Fab from '@/app/tournaments/[id]/dashboard/fab';
import AddNewPlayer from '@/app/tournaments/[id]/dashboard/tabs/table/add-player/add-new-player';
import AddPlayer from '@/app/tournaments/[id]/dashboard/tabs/table/add-player/add-player';
import { Button } from '@/components/ui/button';
import { DatabasePlayer } from '@/lib/db/schema/tournaments';
import { ArrowLeft, Plus, UserPlus, X } from 'lucide-react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { Drawer } from 'vaul';

const AddPlayerDrawer = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [addingNewPlayer, setAddingNewPlayer] = useState(false);

  useHotkeys(
    'shift+equal',
    (e) => {
      e.preventDefault();
      setOpen((prev) => !prev);
    },
    { enableOnFormTags: true },
  );
  useHotkeys(
    'control+shift+equal',
    (e) => {
      e.preventDefault();
      setOpen((prev) => !prev);
      setAddingNewPlayer(true);
    },
    { enableOnFormTags: true },
  );

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

  useEffect(() => {
    // this hook lets you interact with outside fab and avoid Vaul's 'pointer-events: none' style on body
    if (open) {
      // Pushing the change to the end of the call stack
      const timer = setTimeout(() => {
        document.body.style.pointerEvents = '';
      }, 0);

      return () => clearTimeout(timer);
    } else {
      document.body.style.pointerEvents = 'auto';
    }
  }, [open]);

  const container = document.getElementById('dashboard-portal');

  return (
    <Drawer.Root direction="right" onClose={handleClose} open={open}>
      <Fab
        onClick={() => setOpen(!open)}
        icon={open ? X : UserPlus}
        container={container}
      />
      <Drawer.Portal container={container}>
        <Drawer.Overlay className="fixed inset-0 top-0 z-50 bg-black/80" />
        <Drawer.Content
          onInteractOutside={() => setOpen(false)}
          className="fixed bottom-0 left-[5rem] right-0 top-0 z-50 flex flex-col outline-none"
        >
          <Drawer.Title />
          <Drawer.Description />
          <div className="flex h-[100dvh] flex-1 flex-col gap-3 rounded-l-[15px] border border-secondary bg-background p-4">
            <div className="flex flex-col gap-3">
              <Button
                className="flex w-full gap-2"
                onClick={() => setAddingNewPlayer((prev) => !prev)}
                variant={addingNewPlayer ? 'outline' : 'default'}
              >
                {!addingNewPlayer ? <Plus /> : <ArrowLeft />}
                {!addingNewPlayer ? 'add new player' : 'back'}{' '}
                {/* FIXME Intl */}
              </Button>
            </div>
            <div className="w-full">
              {addingNewPlayer ? (
                <AddNewPlayer
                  value={value}
                  setValue={setValue}
                  returnToNewPlayer={returnToNewPlayer}
                  handleClose={handleClose}
                />
              ) : (
                <AddPlayer
                  value={value}
                  setValue={setValue}
                  handleClose={handleClose}
                />
              )}
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export type DrawerProps = {
  value: string;
  handleClose: () => void;
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
