import TournamentItemIteratee from '@/components/tournament-item';
import { TournamentWithClub } from '@/lib/db/queries/get-tournaments-to-user-clubs-query';
import { FC } from 'react';

const TournamentsContainer: FC<{ props: TournamentWithClub[] }> = ({
  props,
}) => {
  const data = props.map((prop) => prop.tournament);
  return <>{data.map(TournamentItemIteratee)}</>;
};

export default TournamentsContainer;
