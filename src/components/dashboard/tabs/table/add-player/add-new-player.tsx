import { DrawerProps } from '@/components/dashboard/tabs/table/add-player';
import { Slider } from '@/components/ui/slider';
import { FC } from 'react';

const AddNewPlayer: FC<DrawerProps> = ({ sliderValue, setSliderValue }) => {
  return (
    <>
      estimated rating: {sliderValue}
      <Slider
        data-vaul-no-drag
        defaultValue={[1500]}
        max={3000}
        step={50}
        className="w-full"
        value={sliderValue}
        onValueChange={(e) => setSliderValue(e)}
      />
    </>
  );
};

export default AddNewPlayer;
