import Games from '@/app/tournament/(tabs)/games';
import Main from '@/app/tournament/(tabs)/main';
import TournamentTable from '@/app/tournament/(tabs)/table';
import { TabType } from '@/app/tournament/[id]/dashboard';

export const tabsArray: TabType[] = [
  { title: 'main', component: Main },
  { title: 'table', component: TournamentTable },
  { title: 'games', component: Games },
  // { title: 'mock slot with long title', component: MockSlotWithLongTitle },
  // { title: 'mock slot', component: MockSlot },
];
