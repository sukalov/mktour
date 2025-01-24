'use client';
import { DashboardContext } from '@/app/tournaments/[id]/dashboard/dashboard-context';
import RoundControls from '@/app/tournaments/[id]/dashboard/tabs/games/round-controls';
import RoundItem from '@/app/tournaments/[id]/dashboard/tabs/games/round-item';
import StartTournamentButton from '@/app/tournaments/[id]/dashboard/tabs/main/start-tournament-button';
import FormattedMessage from '@/components/formatted-message';
import { useTournamentInfo } from '@/components/hooks/query-hooks/use-tournament-info';
import { useTournamentPlayers } from '@/components/hooks/query-hooks/use-tournament-players';
import Overlay from '@/components/overlay';
import SkeletonList from '@/components/skeleton-list';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { useMutationState } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { FC, useContext, useEffect, useState } from 'react';

const RoundsMobile: FC = () => {
  const {
    currentTab,
    roundInView,
    setRoundInView,
    selectedGameId,
    setSelectedGameId,
  } = useContext(DashboardContext);
  const { id } = useParams<{ id: string }>();
  const { data, isError, isLoading } = useTournamentInfo(id);
  const {
    data: players,
    isLoading: isPlayersloading,
    isError: isPlayersError,
  } = useTournamentPlayers(id);
  const mutations = useMutationState({
    filters: { status: 'pending' },
  });
  const t = useTranslations('Tournament.Round');

  ///// TODO Probably should move this block elsewhere
  const [openDrawer, setOpenDrawer] = useState(false);
  const now = new Date().getTime();
  const startedAt = new Date(data?.tournament.started_at!).getTime();
  const renderDrawer = !startedAt || now - startedAt <= 5000;

  useEffect(() => {
    if (!startedAt && !!selectedGameId) setOpenDrawer(true);
    if (startedAt) setOpenDrawer(false);
  }, [selectedGameId, startedAt]);
  /////

  if (isError || isPlayersError) {
    return (
      <div>
        <RoundControls
          roundInView={roundInView}
          setRoundInView={setRoundInView}
          currentRound={1}
          currentTab={currentTab}
        />
      </div>
    );
  }

  if (isLoading || isPlayersloading || mutations.length > 1) {
    return (
      <div>
        <RoundControls
          roundInView={roundInView}
          setRoundInView={setRoundInView}
          currentRound={1}
          currentTab={currentTab}
        />
        <div className="px-4 pt-2">
          <SkeletonList length={8} height={16} />
        </div>
      </div>
    );
  }

  if (!players || players.length < 2) {
    return (
      <p className="text-muted-foreground p-4 text-center text-sm text-balance">
        {t('add two players')}
      </p>
    );
  }

  if (!data) return 'no data'; // FIXME Intl

  return (
    <div>
      <Overlay open={!!selectedGameId} />
      <RoundControls
        roundInView={roundInView}
        setRoundInView={setRoundInView}
        currentRound={data.tournament.ongoing_round}
        currentTab={currentTab}
      />
      <RoundItem roundNumber={roundInView} />
      {renderDrawer && (
        <StartTournamentDrawer
          open={openDrawer}
          onClose={() => setOpenDrawer(false)}
        />
      )}
    </div>
  );
};

const StartTournamentDrawer: FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => (
  <Drawer open={open} onClose={onClose}>
    <DrawerContent>
      <DrawerHeader className="text-left">
        <DrawerTitle>
          <FormattedMessage id="Tournament.Round.start tournament.title" />
        </DrawerTitle>
        <DrawerDescription>
          <FormattedMessage id="Tournament.Round.start tournament.description" />
        </DrawerDescription>
      </DrawerHeader>
      <div className="flex w-full flex-col gap-4 p-4 pt-0">
        <StartTournamentButton />
        <DrawerClose asChild>
          <Button size="lg" variant="outline">
            <FormattedMessage id="Common.cancel" />
          </Button>
        </DrawerClose>
      </div>
    </DrawerContent>
  </Drawer>
);

export default RoundsMobile;
