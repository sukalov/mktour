import { TabType } from '@/app/tournament/[id]/dashboard';
import Main from '@/components/dashboard/tabs/main';
import TournamentTable from '@/components/dashboard/tabs/table';

export const tabs: TabType[] = [
  { title: 'main', component: Main },
  { title: 'table', component: TournamentTable },
  // { title: 'games', component: Games },
  // { title: 'mock slot with long title', component: MockSlotWithLongTitle },
  // { title: 'mock slot', component: MockSlot },
];
