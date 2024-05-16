import RoundItem from '@/components/dashboard/round-item';
import { useTournamentStore } from '@/lib/hooks/use-tournament-store';
import { FC, useRef } from 'react';

const RoundsDesktop: FC = () => {
  const tournament = useTournamentStore();
  const games = tournament?.games
  const currentRound = tournament?.ongoingRound
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
      {games?.map((round: any, roundIndex: number) => (
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
