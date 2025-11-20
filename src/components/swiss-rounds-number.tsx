import { DashboardContext } from '@/app/tournaments/[id]/dashboard/dashboard-context';
import useSaveRoundsNumberMutation from '@/components/hooks/mutation-hooks/use-tournament-update-swiss-rounds-number';
import { useTournamentInfo } from '@/components/hooks/query-hooks/use-tournament-info';
import { useTournamentPlayers } from '@/components/hooks/query-hooks/use-tournament-players';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getSwissMinRoundsNumber } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useContext, useState } from 'react';

export default function SwissRoundsNumber() {
  const { id: tournamentId } = useParams<{ id: string }>();
  const { data } = useTournamentInfo(tournamentId);
  const { data: players } = useTournamentPlayers(tournamentId);
  const t = useTranslations('Tournament.Main');
  const [value, setValue] = useState(data?.tournament.roundsNumber);
  const queryClient = useQueryClient();
  const { sendJsonMessage } = useContext(DashboardContext);
  const { mutate, isPending } = useSaveRoundsNumberMutation(
    queryClient,
    sendJsonMessage,
  );

  const minValue =
    data?.tournament.roundsNumber ||
    (players ? getSwissMinRoundsNumber(players.length) : undefined);

  const isInputChaged =
    (value !== 0 || data?.tournament.roundsNumber) &&
    data?.tournament.roundsNumber !== value;

  return (
    <form
      className="-my-4 inline-flex w-full flex-row items-center-safe gap-3 align-middle"
      onSubmit={(e) => {
        e.preventDefault();
        mutate({
          tournamentId,
          roundsNumber: Number(value),
        });
      }}
    >
      <span>{t('swiss')}</span>
      <Input
        className="max-h-1/2 w-14"
        placeholder={minValue ? minValue.toString() : undefined}
        value={value ? value.toString() : ''}
        onChange={(e) => setValue(Number(e.target.value))}
        name="roundsNumber"
      />
      <Label className="text-base" htmlFor="roundsNumber">
        {t('number of rounds')}
      </Label>
      <div className="grow" />
      {isInputChaged && (
        <Button
          className="max-h-1/2 justify-self-end"
          disabled={isPending || !value}
        >
          {t('save')}
        </Button>
      )}
    </form>
  );
}
