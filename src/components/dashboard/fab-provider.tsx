import { TabType } from '@/app/tournament/[id]/dashboard';
import AddPlayerDrawer from '@/components/dashboard/add-player';
import Fab from '@/components/dashboard/fab';
import { Status } from '@/lib/db/hooks/use-status-in-tournament';
import { Flag, Shuffle } from 'lucide-react';
import { FC } from 'react';

const FabProvider: FC<FabProviderProps> = ({ status, currentTab }) => {
  if (status !== 'organizer') return null;
  return fabTabMap[currentTab];
};

const fabTabMap = {
  main: <Fab icon={Flag} onClick={console.log} />,
  table: <AddPlayerDrawer />,
  games: <Fab icon={Shuffle} onClick={console.log} />,
};

type FabProviderProps = {
  status: Status;
  currentTab: TabType['title'];
};

export default FabProvider;
