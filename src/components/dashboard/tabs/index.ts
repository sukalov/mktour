import { TabType } from '@/app/tournament-rq/[id]/dashboard';
import Games from '@/components/dashboard-rq/tabs/games';
import Main from '@/components/dashboard-rq/tabs/main';
import TournamentTable from '@/components/dashboard-rq/tabs/table';

const tabs: TabType[] = [
  { title: 'main', component: Main },
  { title: 'table', component: TournamentTable },
  { title: 'games', component: Games },
];

export default tabs;
