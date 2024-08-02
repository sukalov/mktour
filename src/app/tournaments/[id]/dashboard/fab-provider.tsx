
import { TabType } from '@/app/tournaments/[id]/dashboard';
import Fab from '@/app/tournaments/[id]/dashboard/fab';
import AddPlayerDrawer from '@/app/tournaments/[id]/dashboard/tabs/table/add-player';
import { Status } from '@/lib/db/hooks/use-status-in-tournament';
import { Shuffle } from 'lucide-react';
import { FC } from 'react';

const FabProvider: FC<FabProviderProps> = ({
  status,
  currentTab,
  scrolling,
}) => {
  if (status !== 'organizer') return null;
  return (
    <div className={`${scrolling && 'opacity-50'}`}>
      {fabTabMap[currentTab]}
    </div>
  );
};

const fabTabMap = {
  main: <AddPlayerDrawer />,
  table: <AddPlayerDrawer />,
  games: <Fab icon={Shuffle} onClick={console.log} />,
};

type FabProviderProps = {
  status: Status;
  currentTab: TabType['title'];
  scrolling: boolean;
};

export default FabProvider;
