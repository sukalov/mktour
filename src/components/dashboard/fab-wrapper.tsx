import { TabType } from "@/app/tournament/[id]/dashboard";
import AddPlayerSheet from "@/components/dashboard/add-player/add-player-sheet";
import { Status } from "@/lib/db/hooks/use-status-in-tournament";
import { FC } from "react";

const FabWrapper: FC<FabWrapperProps> = ({ status, currentTab }) => {
  if (status !== 'organizer') return null
  // if (currentTab === 'table') return <AddPlayerDrawer/>
  if (currentTab === 'table') return <AddPlayerSheet/>
  return
}

type FabWrapperProps = {
  status: Status
  currentTab: TabType['title']
}

export default FabWrapper