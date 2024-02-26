import { TournamentContext } from '@/app/tournament/[id]/dashboard';
import { useContext } from 'react';

const Main = () => {
  const tournament = useContext(TournamentContext);

  return (
    <>
      <span>{tournament?.date}</span>
      <span>{tournament?.format}</span>
      <span>{tournament?.type}</span>
      <span>{tournament?.format}</span>
      <span>{tournament?.is_closed}</span>
    </>
  );
};

export default Main;
