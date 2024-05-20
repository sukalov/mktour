import { HandlerProps } from '@/components/dashboard/add-player';
import { Button } from '@/components/ui/button';
import { Plus, Save } from 'lucide-react';
import { createElement as $, Dispatch, FC, SetStateAction } from 'react';

const AddButton: FC<ButtonProps> = ({
  addingNewPlayer,
  value,
  sliderValue,
  setAddingNewPlayer,
  handleAddPlayer,
}) => {
  return addingNewPlayer
    ? $(AddNewPlayerButton, { value, sliderValue, handleAddPlayer })
    : $(AddExistingPlayerButton, { value, setAddingNewPlayer });
};

const AddExistingPlayerButton: FC<
  Pick<ButtonProps, 'value' | 'setAddingNewPlayer'>
> = ({ value, setAddingNewPlayer }) => {
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

const AddNewPlayerButton: FC<
  Pick<ButtonProps, 'value' | 'sliderValue' | 'handleAddPlayer'>
> = ({ value, sliderValue, handleAddPlayer }) => {
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

type ButtonProps = {
  value: string;
  sliderValue: number[];
  addingNewPlayer: boolean;
  setAddingNewPlayer: Dispatch<SetStateAction<boolean>>;
  handleAddPlayer: (arg0: HandlerProps) => void;
};

export default AddButton;
