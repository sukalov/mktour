import { gamesMock } from '@/app/tournament/[id]/dashboard';
import RoundItem from '@/components/dashboard/tabs/games/round-item';
import { FC } from 'react';

const RoundsMobile: FC = () => {
  const round = gamesMock[0];
  return (
    <div>
      <div className="mt-[6rem] flex w-full flex-col justify-center gap-4 px-4">
        <RoundItem round={round} />
      </div>
    </div>
  );
};

export default RoundsMobile;
