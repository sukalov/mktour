import { DashboardContext } from '@/app/tournaments/[id]/dashboard/dashboard-context';
import RoundControls from '@/app/tournaments/[id]/dashboard/tabs/games/round-controls';
import RoundItem from '@/app/tournaments/[id]/dashboard/tabs/games/round-item';
import Center from '@/components/center';
import { useTournamentInfo } from '@/components/hooks/query-hooks/use-tournament-info';
import { useTournamentPlayers } from '@/components/hooks/query-hooks/use-tournament-players';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { usePathname } from 'next/navigation';
import { FC, useContext, useState } from 'react';

const RoundsMobile: FC = () => {
  const [roundInView, setRoundInView] = useState(1);
  const { currentTab } = useContext(DashboardContext);
  const id = usePathname().split('/').at(-1) as string;
  const { data, isError } = useTournamentInfo(id);
  const { data: players } = useTournamentPlayers(id);
  const [compact, setCompact] = useState(false);

  if (!players) return <></>;
  if (players.length < 2)
    return <Center>{'add at least two players to see generated round'}</Center>;

  if (isError) return 'error';
  if (!data) return 'loading';

  return (
    <div>
      <RoundControls
        roundInView={roundInView}
        setRoundInView={setRoundInView}
        currentRound={data.tournament.ongoing_round}
        currentTab={currentTab}
      />

      <div className="mb-4 mt-14 flex w-full flex-col gap-4 px-4">
        <div className="ml-[2.5rem] flex w-full scale-75 items-center justify-end space-x-2">
          <Label htmlFor="compact">compact view</Label>
          <Switch
            id="compact"
            checked={compact}
            onCheckedChange={(e) => setCompact(e)}
          />
        </div>
        <RoundItem roundNumber={roundInView} compact={compact} />
      </div>
    </div>
  );
};

export default RoundsMobile;
