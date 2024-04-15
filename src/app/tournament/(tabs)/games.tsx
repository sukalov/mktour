import RoundsCarousel from '@/app/tournament/components/rounds-carousel';
import { FC } from 'react';
import { useMediaQuery } from 'react-responsive';

const Games: FC = () => {
  // const { games, currentRound, currentTab } = useContext(TournamentContext);
  // const { games, currentRound } = useContext(TournamentContext);
  const isMobile = useMediaQuery({ maxWidth: 768 });
  // const ref = useRef<any>(null);

  // useEffect(() => {
  //   if (currentTab === 'games' && ref.current) {
  //     ref.current.children[currentRound].scrollIntoView({
  //       inline: 'center',
  //     });
  //   }
  // }, [currentRound, currentTab]);

  if (isMobile) return <RoundsCarousel />;

  return null
//   return (
//     <div
//       ref={ref}
//       id="rounds"
//       className="scrollbar-hide flex justify-between gap-8 overflow-scroll px-4"
//     >
//       {games.map((round: Round[], roundIndex: number) => (
//         <div
//           className="flex flex-col justify-center gap-4 text-center"
//           key={roundIndex}
//         >
//           Round {roundIndex}
//           {roundIndex === currentRound && '(current)'}
//           <RoundItem key={roundIndex} round={round} />
//         </div>
//       ))}
//     </div>
//   );
};

export default Games;
