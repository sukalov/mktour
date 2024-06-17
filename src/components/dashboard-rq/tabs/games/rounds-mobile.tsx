import Loading from '@/app/loading';
import { gamesMock } from '@/app/tournament-rq/[id]/dashboard';
import { DashboardContext } from '@/components/dashboard-rq/dashboard-context';
import RoundControls from '@/components/dashboard-rq/tabs/games/round-controls';
import RoundItem from '@/components/dashboard-rq/tabs/games/round-item';
import { useTournamentInfo } from '@/components/hooks/query-hooks/use-tournament-info';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { usePathname } from 'next/navigation';
import { FC, useContext, useState } from 'react';

const RoundsMobile: FC = () => {
  const round = gamesMock[0];
  const [roundInView, setRoundInView] = useState(0);
  const { currentTab } = useContext(DashboardContext);
  const id = usePathname().split('/').at(-1) as string;
  const tournament = useTournamentInfo(id);
  const [compact, setCompact] = useState(true);

  if (tournament.isLoading) return <Loading />;
  if (tournament.isError) {
    return null;
  }

  return (
    <div>
      <RoundControls
        props={{
          roundInView,
          games: gamesMock,
          setRoundInView,
          currentRound: tournament.data?.tournament.ongoing_round,
          currentTab,
        }}
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
        {Array(10)
          .fill('')
          .map((_, i) => (
            <RoundItem round={round} key={i} compact={compact} />
          ))}
      </div>
    </div>
  );
};

export default RoundsMobile;
