import { TabType } from '@/app/tournament/[id]/dashboard';
import Fab from '@/components/dashboard/fab';
import AddPlayerDrawer from '@/components/dashboard/tabs/table/add-player';
import { Status } from '@/lib/db/hooks/use-status-in-tournament';
import { Shuffle } from 'lucide-react';
import { FC } from 'react';

const FabProvider: FC<FabProviderProps> = ({ status, currentTab }) => {
  if (status !== 'organizer') return null;
  return fabTabMap[currentTab];
};

const fabTabMap = {
  main: <AddPlayerDrawer />,
  table: <AddPlayerDrawer />,
  games: <Fab icon={Shuffle} onClick={console.log} />,
};

type FabProviderProps = {
  status: Status;
  currentTab: TabType['title'];
};

export default FabProvider;
