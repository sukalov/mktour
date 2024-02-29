import { TournamentContext } from '@/app/tournament/[id]/tournament-context';
import StyledCard from '@/app/tournament/components/styled-card';
import { useContext } from 'react';

const Main = () => {
  const { tournament } = useContext(TournamentContext);

  return (
    <StyledCard>
      <span>{tournament?.date}</span>
      <span>{tournament?.format}</span>
      <span>{tournament?.type}</span>
      <span>{tournament?.is_closed}</span>
    </StyledCard>
  );
};

export default Main;
