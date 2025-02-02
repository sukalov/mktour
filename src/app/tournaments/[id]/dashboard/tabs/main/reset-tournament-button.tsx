'use client';

import { LoadingSpinner } from '@/app/loading';
import { DashboardContext } from '@/app/tournaments/[id]/dashboard/dashboard-context';
import useTournamentReset from '@/components/hooks/mutation-hooks/use-tournament-reset';
import useComboModal from '@/components/hooks/use-combo-modal';
import { Button } from '@/components/ui/button';
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
  const ComboModal = useComboModal();

  return (
    <ComboModal.Root open={open} onOpenChange={setOpen}>
      <ComboModal.Trigger asChild>
        <Button variant="destructive">
          <CircleX />
          &nbsp;{t('reset progress')}
        </Button>
      </ComboModal.Trigger>
      <ComboModal.Content className="pb-4">
        <ComboModal.Header className="text-left">
          <ComboModal.Title>{t('confirmation header')}</ComboModal.Title>
          <ComboModal.Description>
            {t.rich('confirmation body')}
          </ComboModal.Description>
        </ComboModal.Header>
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
          <ComboModal.Close asChild>
            <Button className="w-full" variant="outline">
              {t('cancel')}
            </Button>
          </ComboModal.Close>
        </div>
      </ComboModal.Content>
    </ComboModal.Root>
  );
}
