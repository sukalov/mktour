'use client';

import { DashboardContext } from '@/app/tournaments/[id]/dashboard/dashboard-context';
import StartTournamentButton from '@/app/tournaments/[id]/dashboard/tabs/main/start-tournament-button';
import FormattedMessage from '@/components/formatted-message';
import { Button } from '@/components/ui/button';
import {
  Close,
  Content,
  Description,
  Header,
  Root,
  Title,
} from '@/components/ui/combo-modal';
import { FC, useContext, useEffect, useState } from 'react';

const StartTournamentDrawer: FC<{
  startedAt: number | undefined;
}> = ({ startedAt }) => {
  const [open, setOpen] = useState(false);
  const { selectedGameId } = useContext(DashboardContext);

  useEffect(() => {
    if (!startedAt && !!selectedGameId) setOpen(true);
    if (startedAt) setOpen(false);
  }, [selectedGameId, startedAt]);

  return (
    <Root open={open} onOpenChange={setOpen}>
      <Content>
        <Header>
          <Title>
            <FormattedMessage id="Tournament.Round.start tournament.title" />
          </Title>
          <Description>
            <FormattedMessage id="Tournament.Round.start tournament.description" />
          </Description>
        </Header>
        <StartTournamentButton />
        <Close asChild>
          <Button size="lg" variant="outline">
            <FormattedMessage id="Common.cancel" />
          </Button>
        </Close>
      </Content>
    </Root>
  );
};

export default StartTournamentDrawer;
