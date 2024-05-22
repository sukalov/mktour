import { DrawerProps } from '@/components/dashboard/tabs/table/add-player';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Save } from 'lucide-react';
import { FC } from 'react';

const AddNewPlayer: FC<DrawerProps> = ({
  sliderValue,
  setSliderValue,
  handleAddPlayer,
  value,
}) => {
  return (
    <div className="flex flex-col gap-2">
      estimated rating: {sliderValue}
      <Slider
        data-vaul-no-drag
        defaultValue={[1500]}
        max={3000}
        step={50}
        className="w-full pb-4"
        value={sliderValue}
        onValueChange={(e) => setSliderValue(e)}
      />
      <Button
        size="sm"
        onClick={() => handleAddPlayer({ rating: sliderValue[0] })}
        disabled={value === ''}
      >
        <Save /> &nbsp;save
      </Button>
    </div>
  );
};

export default AddNewPlayer;
