import Games from '@/app/tournament/(tabs)/games';
import Main from '@/app/tournament/(tabs)/main';
import MockSlot from '@/app/tournament/(tabs)/mock-slot';
import MockSlotWithLongTitle from '@/app/tournament/(tabs)/mock-slot-with-long-title';
import TournamentTable from '@/app/tournament/(tabs)/table';
import { TabType } from '@/app/tournament/[id]/tournament-context';

export const tabsArray: TabType[] = [
  { title: 'main', component: Main },
  { title: 'table', component: TournamentTable },
  { title: 'games', component: Games },
  { title: 'mock slot with long title', component: MockSlotWithLongTitle },
  { title: 'mock slot', component: MockSlot },
];
