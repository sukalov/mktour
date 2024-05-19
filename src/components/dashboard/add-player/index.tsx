import AddNewPlayer from '@/components/dashboard/add-player/add-new-player';
import AddPlayer from '@/components/dashboard/add-player/add-player';
import { DashboardContext } from '@/components/dashboard/dashboard-context';
import Fab from '@/components/dashboard/fab';
import {
  onClickAddExistingPlayer,
  onClickAddNewPlayer,
} from '@/components/dashboard/helpers/on-click-handlers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { faker } from '@faker-js/faker';
import { Plus, Save } from 'lucide-react';
import {
  Dispatch,
  FC,
  SetStateAction,
  createElement,
  useContext,
  useState,
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

  const button = createElement(
    addingNewPlayer ? AddNewPlayerButton : AddPlayerButton,
    { value, setAddingNewPlayer, sliderValue, handleAddPlayer },
  );

  const content = createElement(addingNewPlayer ? AddNewPlayer : AddPlayer, {
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
        <div>{button}</div>
        <div className="scrollbar-hide flex h-[85svh] w-full flex-col items-start gap-2 overflow-scroll p-4 pt-0">
          {content}
        </div>
      </SheetContent>
    </Sheet>
  );
};

// FIXME any
const AddPlayerButton: FC<any> = ({ value, setAddingNewPlayer }) => {
  return (
    <Button
      disabled={!value}
      size={'sm'}
      className="flex w-full gap-2 text-muted shadow-md shadow-background"
      variant={'outline'}
      onClick={() => setAddingNewPlayer(true)}
    >
      <Plus /> add new player
    </Button>
  );
};

// FIXME any
const AddNewPlayerButton: FC<any> = ({
  value,
  handleAddPlayer,
  sliderValue,
}) => {
  return (
    <Button
      disabled={!value}
      size={'sm'}
      className="flex w-full gap-2 text-muted shadow-md shadow-background"
      variant={'outline'}
      onClick={() => handleAddPlayer({ rating: sliderValue[0] })}
    >
      <Save /> save
    </Button>
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
