import { DashboardContext } from '@/app/tournament/[id]/dashboard-context';
import RoundItem from '@/app/tournament/components/round-item';
import { FC, useContext, useEffect, useState } from 'react';

const RoundsMobile: FC = () => {
  const { games, currentRound, top } = useContext(DashboardContext);
  const [roundInView, setRoundInView] = useState(currentRound);
  const round = games[roundInView];

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [roundInView]);

  const controlsTop = top === 'top-[3.5rem]' ? 'top-[7.5rem]' : 'top-[3.5rem]';

  return (
    <div>
      <div className="mt-[6rem] flex w-full flex-col justify-center gap-4 px-4">
        <RoundItem round={round} />
      </div>
    </div>
  );
};

export default RoundsMobile;
