import { DashboardContext } from '@/components/dashboard/dashboard-context';
import Fab from '@/components/dashboard/fab';
import AddNewPlayer from '@/components/dashboard/tabs/table/add-player/add-new-player';
import AddPlayer from '@/components/dashboard/tabs/table/add-player/add-player';
import FabClose from '@/components/dashboard/tabs/table/add-player/fab-close';
import {
  onClickAddExistingPlayer,
  onClickAddNewPlayer,
} from '@/components/helpers/on-click-handlers';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, UserPlus } from 'lucide-react';
import { Dispatch, SetStateAction, useContext, useState } from 'react';
import { Drawer } from 'vaul';

const AddPlayerDrawer = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [addingNewPlayer, setAddingNewPlayer] = useState(false);
  const { sendJsonMessage } = useContext(DashboardContext);

  const handleClose = () => {
    setOpen(false);
    setAddingNewPlayer(false);
    setValue('');
  };

  const handleAddPlayer = (props: HandlerProps) => {
    if (props.type === 'existing')
      onClickAddExistingPlayer(props.id, sendJsonMessage);
    else onClickAddNewPlayer(props.name, props.rating, sendJsonMessage);
    setOpen(false);
    setValue('');
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
          <Fab onClick={() => setOpen(true)} icon={UserPlus} />
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
                handleAddPlayer={handleAddPlayer}
                value={value}
                setValue={setValue}
              />
            ) : (
              <AddPlayer
                handleAddPlayer={handleAddPlayer}
                value={value}
                setValue={setValue}
              />
            )}
          </div>
          <FabClose onClick={() => setOpen(false)} />
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export type DrawerProps = {
  handleAddPlayer: (_arg0: HandlerProps) => void;
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
