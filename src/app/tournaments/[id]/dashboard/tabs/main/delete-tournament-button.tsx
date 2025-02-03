'use client';

import { LoadingSpinner } from '@/app/loading';
import { DashboardContext } from '@/app/tournaments/[id]/dashboard/dashboard-context';
import useTournamentDelete from '@/components/hooks/mutation-hooks/use-tournament-delete';
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

export default function DeleteTournamentButton() {
  const { id: tournamentId } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { sendJsonMessage } = useContext(DashboardContext);
  const { mutate, isPending } = useTournamentDelete(
    tournamentId,
    queryClient,
    sendJsonMessage,
  );
  const [open, setOpen] = useState(false);
  const t = useTranslations('Tournament.Main');

  return (
    <Root open={open} onOpenChange={setOpen}>
      <Trigger asChild>
        <Button variant="destructive">
          <CircleX />
          &nbsp;{t('Delete.title')}
        </Button>
      </Trigger>
      <Content className="pb-4">
        <Header className="text-left">
          <Title>{t('Delete.confirmation header')}</Title>
          <Description>{t.rich('Delete.confirmation body')}</Description>
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
            {t('Delete.confirm')}
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
