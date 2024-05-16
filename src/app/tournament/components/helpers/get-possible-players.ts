import { DatabasePlayer } from '@/lib/db/schema/tournaments';
import { TournamentStore } from '@/lib/hooks/use-tournament-store';
import { TournamentModel } from '@/types/tournaments';

const getPossiblePlayers = async (id: string, state: TournamentModel, tournament: TournamentStore) => {
  const possiblePlayersReq = await fetch('/api/tournament-possible-players', {
    method: 'POST',
    body: JSON.stringify({
      id,
      tournament: state,
    }),
  });
  const possiblePlayers =
    (await possiblePlayersReq.json()) as Array<DatabasePlayer>;
  tournament.initPossiblePlayers(possiblePlayers);
};

export default getPossiblePlayers