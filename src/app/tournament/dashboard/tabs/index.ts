import { TabType } from "@/app/tournament/dashboard";
import Games from "@/app/tournament/dashboard/tabs/games";
import Main from "@/app/tournament/dashboard/tabs/main";
import TournamentTable from "@/app/tournament/dashboard/tabs/table";


const tabs: TabType[] = [
  { title: 'main', component: Main },
  { title: 'table', component: TournamentTable },
  { title: 'games', component: Games },
];

export default tabs;
