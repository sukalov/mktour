import { TabType } from "@/app/tournament/[id]/dashboard";
import Games from "@/app/tournament/[id]/dashboard/tabs/games";
import Main from "@/app/tournament/[id]/dashboard/tabs/main";
import TournamentTable from "@/app/tournament/[id]/dashboard/tabs/table";


const tabs: TabType[] = [
  { title: 'main', component: Main },
  { title: 'table', component: TournamentTable },
  { title: 'games', component: Games },
];

export default tabs;
