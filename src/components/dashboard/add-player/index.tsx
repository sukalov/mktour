import AddNewPlayer from '@/components/dashboard/add-player/add-new-player';
import AddPlayer from '@/components/dashboard/add-player/add-player';
import { DashboardContext } from '@/components/dashboard/dashboard-context';
import Fab from '@/components/dashboard/fab';
import {
  onClickAddExistingPlayer,
  onClickAddNewPlayer,
} from '@/components/dashboard/helpers/on-click-handlers';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
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
import { Drawer } from 'vaul';

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

  const tags = Array.from({ length: 50 }).map(
    (_, i, a) => `v1.2.0-beta.${a.length - i}`,
  );

  return (
    <Drawer.Root shouldScaleBackground direction="right" preventScrollRestoration={false}>
      <Drawer.Trigger asChild>
        <Fab />
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 top-0 bg-black/40" />
        <Drawer.Content className="fixed bottom-0 left-4 right-0 top-0 z-50 flex flex-col">
          <div className="flex-1 rounded-l-[10px] bg-muted p-6">
            <ScrollArea className="h-full w-full rounded-md border border-primary">
              <ul>
              {tags.map((tag) => (
                  <li key={tag} className="text-sm">
                    {tag}
                  <Separator className="my-2" />
                  </li>
              ))}
              </ul>
            </ScrollArea>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
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
