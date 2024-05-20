import { PlayerProps } from '@/components/dashboard/add-player';
import { Button } from '@/components/ui/button';
import { Plus, Save } from 'lucide-react';
import { FC } from 'react';

const AddButton: FC<PlayerProps> = ({
  addingNewPlayer,
  value,
  setAddingNewPlayer,
  handleAddPlayer,
  sliderValue,
}) => {
  return (
    <Button
      disabled={!value && addingNewPlayer}
      size={'sm'}
      className="flex w-full gap-2"
      onClick={() => {
        if (!addingNewPlayer) setAddingNewPlayer(true);
        else handleAddPlayer({ rating: sliderValue[0] });
      }}
    >
      {!addingNewPlayer ? <Plus /> : <Save />}
      {!addingNewPlayer ? 'add new player' : 'save'}
    </Button>
  );
};

export default AddButton;
