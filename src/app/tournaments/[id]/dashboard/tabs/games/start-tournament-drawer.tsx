'use client';

import { DashboardContext } from '@/app/tournaments/[id]/dashboard/dashboard-context';
import StartTournamentButton from '@/app/tournaments/[id]/dashboard/tabs/main/start-tournament-button';
import FormattedMessage from '@/components/formatted-message';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { FC, useContext, useEffect, useState } from 'react';

const StartTournamentDrawer: FC<{
  startedAt: number | undefined;
}> = ({ startedAt }) => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const { selectedGameId } = useContext(DashboardContext);

  useEffect(() => {
    if (!startedAt && !!selectedGameId) setOpenDrawer(true);
    if (startedAt) setOpenDrawer(false);
  }, [selectedGameId, startedAt]);

  return (
    <Drawer open={openDrawer} onClose={() => setOpenDrawer(false)}>
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
};

export default StartTournamentDrawer;
