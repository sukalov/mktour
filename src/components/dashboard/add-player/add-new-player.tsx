import { PlayerProps } from '@/components/dashboard/add-player/add-player';
import { DashboardContext } from '@/components/dashboard/dashboard-context';
import { onClickAddNewPlayer } from '@/components/dashboard/helpers/on-click-handlers';
import { Button } from '@/components/ui/button';
import { SheetHeader } from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import { Save } from 'lucide-react';
import { FC, useContext, useState } from 'react';

const AddNewPlayer: FC<PlayerProps> = ({ value }) => {
  const [sliderValue, setSliderValue] = useState([1500]);
  const { sendJsonMessage } = useContext(DashboardContext)

  return (
    <>
      <SheetHeader>
        <Button
          disabled={!value}
          size={'sm'}
          className="flex w-full gap-2 text-muted shadow-current drop-shadow-md"
          variant={'outline'}
          onClick={() => onClickAddNewPlayer(sendJsonMessage)}
        >
          <Save /> save
        </Button>
      </SheetHeader>
      <div className="scrollbar-hide flex h-full w-full flex-col items-start gap-4 overflow-y-scroll p-4 pt-4">
        estimated rating: {sliderValue}
        <Slider
          defaultValue={[1500]}
          max={3000}
          step={50}
          className="w-full"
          value={sliderValue}
          onValueChange={(e) => setSliderValue(e)}
        />
      </div>
    </>
  );
};

export default AddNewPlayer;
