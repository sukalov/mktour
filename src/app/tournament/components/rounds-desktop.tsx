import {
  DashboardContext,
  Round,
} from '@/app/tournament/[id]/dashboard-context';
import RoundItem from '@/app/tournament/components/round-item';
import { FC, useContext, useRef } from 'react';

const RoundsDesktop: FC = () => {
  const { games, currentRound } = useContext(DashboardContext);
  const ref = useRef<any>(null);

  // useEffect(() => {
  //   if (currentTab === 'games' && ref.current) {
  //     ref.current.children[currentRound || 0].scrollIntoView({
  //       inline: 'center',
  //       block: 'start'
  //     });
  //   }
  // }, [currentRound, currentTab]);

  return (
    <div
      ref={ref}
      id="rounds"
      className="scrollbar-hide flex justify-between gap-8 overflow-scroll p-4"
    >
      {games.map((round: Round, roundIndex: number) => (
        <div
          className="flex flex-col justify-center gap-4 text-center"
          key={roundIndex}
        >
          Round {roundIndex}
          {roundIndex === currentRound && '(current)'}
          <RoundItem key={roundIndex} round={round} />
        </div>
      ))}
    </div>
  );
};

export default RoundsDesktop;
