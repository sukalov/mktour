'use client';

import { LoadingSpinner } from '@/app/loading';
import { DashboardContext } from '@/app/tournaments/[id]/dashboard/dashboard-context';
import useTournamentDelete from '@/components/hooks/mutation-hooks/use-tournament-delete';
import useComboModal from '@/components/hooks/use-combo-modal';
import { Button } from '@/components/ui/button';
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

  const { Close, Content, Description, Header, Root, Title, Trigger } =
    useComboModal();

  return (
    <Root open={open} onOpenChange={setOpen}>
      <Trigger asChild>
        <Button variant="destructive">
          <CircleX />
          &nbsp;{t('Delete.title')}
        </Button>
      </Trigger>
      <Content>
        <Header>
          <Title>{t('Delete.confirmation header')}</Title>
          <Description>{t.rich('Delete.confirmation body')}</Description>
        </Header>
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
      </Content>
    </Root>
  );
}
