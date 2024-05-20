import { PlayerProps } from '@/components/dashboard/add-player';
import { Slider } from '@/components/ui/slider';
import { FC } from 'react';

const AddNewPlayer: FC<PlayerProps> = ({ sliderValue, setSliderValue }) => (
  <>
    estimated rating: {sliderValue}
    <Slider
      defaultValue={[1500]}
      max={3000}
      step={50}
      className="w-full"
      value={sliderValue}
      onValueChange={(e) => setSliderValue(e)}
    />
  </>
);

export default AddNewPlayer;
