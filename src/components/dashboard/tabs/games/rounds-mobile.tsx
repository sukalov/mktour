import { gamesMock } from '@/app/tournament/[id]/dashboard';
import { DashboardContext } from '@/components/dashboard/dashboard-context';
import RoundControls from '@/components/dashboard/tabs/games/round-controls';
import RoundItem from '@/components/dashboard/tabs/games/round-item';
import { useTournamentStore } from '@/lib/hooks/use-tournament-store';
import { FC, useContext, useState } from 'react';

const RoundsMobile: FC = () => {
  const round = gamesMock[0];
  const [roundInView, setRoundInView] = useState(0);
  const { currentTab } = useContext(DashboardContext);
  const { ongoingRound } = useTournamentStore();

  return (
    <div>
      <RoundControls
        props={{
          roundInView,
          games: gamesMock,
          setRoundInView,
          currentRound: ongoingRound,
          currentTab,
        }}
      />
      <div className="mb-4 mt-16 flex w-full flex-col justify-center gap-4 px-4">
        {Array(10)
          .fill('')
          .map((_, i) => (
            <RoundItem round={round} key={i} />
          ))}
      </div>
    </div>
  );
};

export default RoundsMobile;
