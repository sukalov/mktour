import { DashboardContext } from '@/components/dashboard/dashboard-context';
import Fab from '@/components/dashboard/fab';
import {
  onClickAddExistingPlayer,
  onClickAddNewPlayer,
} from '@/components/dashboard/helpers/on-click-handlers';
import AddNewPlayer from '@/components/dashboard/tabs/table/add-player/add-new-player';
import AddPlayer from '@/components/dashboard/tabs/table/add-player/add-player';
import FabClose from '@/components/dashboard/tabs/table/add-player/fab-close';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Plus, UserPlus } from 'lucide-react';
import {
  Dispatch,
  SetStateAction,
  createElement,
  useContext,
  useState,
} from 'react';
import { Drawer } from 'vaul';

const AddPlayerDrawer = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [addingNewPlayer, setAddingNewPlayer] = useState(false);
  const [sliderValue, setSliderValue] = useState([1500]);
  const { sendJsonMessage } = useContext(DashboardContext);

  const handleClose = () => {
    setOpen(false);
    setValue('');
    setAddingNewPlayer(false);
  };

  const handleAddPlayer = ({ id, rating }: HandlerProps) => {
    if (id) onClickAddExistingPlayer(id, sendJsonMessage);
    if (rating) onClickAddNewPlayer(value, rating!, sendJsonMessage);
    setOpen(false);
    setValue('');
  };

  const content = createElement(addingNewPlayer ? AddNewPlayer : AddPlayer, {
    value,
    setAddingNewPlayer,
    handleAddPlayer,
    sliderValue,
    setSliderValue,
  });

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
              size={'sm'}
              className="flex w-full gap-2"
              onClick={() => setAddingNewPlayer((prev) => !prev)}
              variant={addingNewPlayer ? 'outline' : 'default'}
            >
              {!addingNewPlayer ? <Plus /> : <ArrowLeft />}
              {!addingNewPlayer ? 'add new player' : 'back'}
            </Button>
            <Input
              value={value}
              placeholder={addingNewPlayer ? 'name' : 'search'}
              onChange={(e) => setValue(e.target.value)}
            />
            <div className="absolute h-1 w-full shadow-red-600 drop-shadow-2xl"></div>
            <ScrollArea className="rounded-2 h-[79svh]">{content}</ScrollArea>
          </div>
          <FabClose onClick={() => setOpen(false)} />
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export type DrawerProps = {
  value: string;
  addingNewPlayer?: boolean;
  setAddingNewPlayer: Dispatch<SetStateAction<boolean>>;
  handleAddPlayer: (arg0: HandlerProps) => void;
  sliderValue: number[];
  setSliderValue: Dispatch<SetStateAction<number[]>>;
};

export type HandlerProps = {
  id?: string;
  rating?: any;
};

export default AddPlayerDrawer;