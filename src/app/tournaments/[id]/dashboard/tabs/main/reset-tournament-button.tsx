'use client';

import { LoadingSpinner } from '@/app/loading';
import { DashboardContext } from '@/app/tournaments/[id]/dashboard/dashboard-context';
import useTournamentReset from '@/components/hooks/mutation-hooks/use-tournament-reset';
import { Button } from '@/components/ui/button';
import {
  Close,
  Content,
  Description,
  Header,
  Root,
  Title,
  Trigger,
} from '@/components/ui/combo-modal';
import { useQueryClient } from '@tanstack/react-query';
import { CircleX } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useContext, useState } from 'react';

export default function ResetTournamentButton() {
  const { id: tournamentId } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { sendJsonMessage, setRoundInView } = useContext(DashboardContext);
  const { mutate, isPending } = useTournamentReset(
    tournamentId,
    queryClient,
    sendJsonMessage,
    setRoundInView,
  );
  const [open, setOpen] = useState(false);
  const t = useTranslations('Tournament.Main');

  return (
    <Root open={open} onOpenChange={setOpen}>
      <Trigger asChild>
        <Button variant="destructive">
          <CircleX />
          &nbsp;{t('reset progress')}
        </Button>
      </Trigger>
      <Content className="pb-4">
        <Header className="text-left">
          <Title>{t('confirmation header')}</Title>
          <Description>{t.rich('confirmation body')}</Description>
        </Header>
        <div className="flex flex-col gap-4 px-4 md:p-0">
          <Button
            variant={'destructive'}
            className="w-full"
            onClick={() => mutate()}
            disabled={isPending}
          >
            {isPending ? <LoadingSpinner /> : <CircleX />}
            &nbsp;
            {t('confirm reset')}
          </Button>
          <Close asChild>
            <Button className="w-full" variant="outline">
              {t('cancel')}
            </Button>
          </Close>
        </div>
      </Content>
    </Root>
  );
}
