import AddButton from '@/components/dashboard/add-player/add-button';
import AddNewPlayer from '@/components/dashboard/add-player/add-new-player';
import AddPlayer from '@/components/dashboard/add-player/add-player';
import FabClose from '@/components/dashboard/add-player/fab-close';
import { DashboardContext } from '@/components/dashboard/dashboard-context';
import Fab from '@/components/dashboard/fab';
import {
  onClickAddExistingPlayer,
  onClickAddNewPlayer,
} from '@/components/dashboard/helpers/on-click-handlers';
import { Input } from '@/components/ui/input';
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
          <Fab onClick={() => setOpen(true)} />
        </div>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 top-0 bg-black/80" />
        <Drawer.Content className="fixed bottom-0 left-4 right-0 top-0 z-50 flex flex-col">
          <div className="flex flex-1 flex-col gap-3 rounded-l-[10px] border border-secondary bg-background px-6 pt-8">
            <AddButton
              addingNewPlayer={addingNewPlayer}
              value={value}
              setAddingNewPlayer={setAddingNewPlayer}
              handleAddPlayer={handleAddPlayer}
              sliderValue={sliderValue}
              setSliderValue={setSliderValue}
            />
            <Input
              value={value}
              placeholder={addingNewPlayer ? 'name' : 'search'}
              onChange={(e) => setValue(e.target.value)}
            />
            <div className="scrollbar-hide rounded-2 flex h-[79svh] w-full flex-col items-start gap-2 overflow-scroll py-0">
              {content}
            </div>
          </div>
          <FabClose onClick={() => setOpen(false)} />
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export type PlayerProps = {
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
