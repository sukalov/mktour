import { TournamentWithClub } from '@/lib/db/queries/get-tournaments-to-user-clubs-query';

const getGroupedTournaments = (props: TournamentWithClub[]) =>
  props.reduce(
    (acc, curr) => {
      const { id: clubId, name: clubName } = curr.club;
      if (!acc[clubId]) {
        acc[clubId] = {
          clubName,
          tournaments: [],
        };
      }
      acc[clubId].tournaments.push(curr);
      return acc;
    },
    {} as Record<
      string,
      { clubName: string; tournaments: TournamentWithClub[] }
    >,
  );

export default getGroupedTournaments;
