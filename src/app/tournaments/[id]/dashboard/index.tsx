'use client';

import CarouselContainer from '@/app/tournaments/[id]/dashboard/carousel-container';
import {
  DashboardContext,
  DashboardContextType,
} from '@/app/tournaments/[id]/dashboard/dashboard-context';
import FabProvider from '@/app/tournaments/[id]/dashboard/fab-provider';
import TabsContainer from '@/app/tournaments/[id]/dashboard/tabs-container';
import { useDashboardWebsocket } from '@/components/hooks/use-dashboard-websocket';
import { Status } from '@/server/queries/get-status-in-tournament';
import { useQueryClient } from '@tanstack/react-query';
import { Dispatch, FC, SetStateAction, useState } from 'react';

const Dashboard: FC<TournamentPageContentProps> = ({
  userId,
  session,
  id,
  status,
  currentRound,
}) => {
  const [scrolling, setScrolling] = useState(false);
  const [currentTab, setCurrentTab] =
    useState<DashboardContextType['currentTab']>('main');
  const queryClient = useQueryClient();
  const [roundInView, setRoundInView] = useState(currentRound || 1);
  const { sendJsonMessage } = useDashboardWebsocket(
    session,
    id,
    queryClient,
    setRoundInView,
  );
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);

  return (
    <DashboardContext.Provider
      value={{
        currentTab,
        sendJsonMessage,
        status,
        userId,
        setSelectedGameId,
        selectedGameId,
        roundInView,
        setRoundInView,
      }}
    >
      <TabsContainer currentTab={currentTab} setCurrentTab={setCurrentTab} />
      <CarouselContainer
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        setScrolling={setScrolling}
      />
      <FabProvider
        status={status}
        currentTab={currentTab}
        scrolling={scrolling}
      />
    </DashboardContext.Provider>
  );
};

export type TabProps = {
  currentTab: DashboardContextType['currentTab'];
  setCurrentTab: Dispatch<SetStateAction<DashboardContextType['currentTab']>>;
  top?: string;
};

export type TabType = {
  title: 'main' | 'table' | 'games';
  component: FC;
};

interface TournamentPageContentProps {
  session: string | undefined;
  id: string;
  status: Status;
  userId: string | undefined;
  currentRound: number | null;
}

export default Dashboard;
