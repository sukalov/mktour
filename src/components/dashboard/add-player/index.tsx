import AddButton from '@/components/dashboard/add-player/add-button';
import AddExistingPlayer from '@/components/dashboard/add-player/add-existing-player';
import AddNewPlayer from '@/components/dashboard/add-player/add-new-player';
import { DashboardContext } from '@/components/dashboard/dashboard-context';
import Fab from '@/components/dashboard/fab';
import {
  onClickAddExistingPlayer,
  onClickAddNewPlayer,
} from '@/components/dashboard/helpers/on-click-handlers';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { faker } from '@faker-js/faker';
import {
  createElement as $,
  Dispatch,
  SetStateAction,
  useContext,
  useState
} from 'react';

const AddPlayerSheet = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [addingNewPlayer, setAddingNewPlayer] = useState(false);
  const [sliderValue, setSliderValue] = useState([1500]);
  const { sendJsonMessage } = useContext(DashboardContext);

  const handleClose = () => {
    setValue('');
    setAddingNewPlayer(false);
  };

  const handleAddPlayer = ({ id, rating }: HandlerProps) => {
    if (id) onClickAddExistingPlayer(id, sendJsonMessage);
    if (rating) onClickAddNewPlayer(value, rating!, sendJsonMessage);
    setOpen(false);
    setValue('');
  };

  const content = $(addingNewPlayer ? AddNewPlayer : AddExistingPlayer, {
    value,
    setAddingNewPlayer,
    handleAddPlayer,
    sliderValue,
    setSliderValue,
  });

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <div>
          <Fab />
        </div>
      </SheetTrigger>
      <SheetContent
        onCloseAutoFocus={handleClose}
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="flex w-[75vw] flex-col gap-2 p-1"
      >
        <Input
          value={value}
          placeholder="search"
          onChange={(e) => setValue(e.target.value)}
        />
        <div>
          <AddButton
            value={value}
            sliderValue={sliderValue}
            addingNewPlayer={addingNewPlayer}
            setAddingNewPlayer={setAddingNewPlayer}
            handleAddPlayer={handleAddPlayer}
          />
        </div>
        <div className="scrollbar-hide flex h-[85svh] w-full flex-col items-start gap-2 overflow-scroll p-4 pt-0">
          {content}
        </div>
      </SheetContent>
    </Sheet>
  );
};

const getMockList = (n: number) =>
  Array(n)
    .fill('')
    .map((_, i) => <div key={i}>{i + '. ' + faker.person.fullName()}</div>);

export type PlayerProps = {
  value: string;
  setAddingNewPlayer: Dispatch<SetStateAction<boolean>>;
  handleAddPlayer: (arg0: HandlerProps) => void;
  sliderValue: number[];
  setSliderValue: Dispatch<SetStateAction<number[]>>;
};

export type HandlerProps = {
  id?: string;
  rating?: any;
};

export default AddPlayerSheet;
