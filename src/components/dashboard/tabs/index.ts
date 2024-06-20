import { TabType } from '@/app/tournament/[id]/dashboard';
import Games from '@/components/dashboard/tabs/games';
import Main from '@/components/dashboard/tabs/main';
import TournamentTable from '@/components/dashboard/tabs/table';

const tabs: TabType[] = [
  { title: 'main', component: Main },
  { title: 'table', component: TournamentTable },
  { title: 'games', component: Games },
];

export default tabs;
