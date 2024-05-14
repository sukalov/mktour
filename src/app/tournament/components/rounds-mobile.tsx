import { DashboardContext } from '@/app/tournament/[id]/dashboard-context';
import RoundItem from '@/app/tournament/components/round-item';
import { FC, useContext, useEffect } from 'react';

const RoundsMobile: FC = () => {
  const { tournament, roundInView } = useContext(DashboardContext);
  const round = tournament?.games[roundInView];

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [roundInView]);

  return (
    <div>
      <div className="mt-[6rem] flex w-full flex-col justify-center gap-4 px-4">
        <RoundItem round={round} />
      </div>
    </div>
  );
};

export default RoundsMobile;
