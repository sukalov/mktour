import useAllClubPlayersQuery from '@/lib/db/hooks/use-all-club-players-query';
import { TournamentModel } from '@/types/tournaments';

export async function POST(req: Request) {
  const { tournament } = (await req.json()) as ReqModel;

  const participantIDs = tournament.players.map((player) => player.id);
  const possiblePlayers = (
    await useAllClubPlayersQuery(tournament.organizer.id)
  ).filter((player) => !participantIDs.includes(player.id));

  return new Response(JSON.stringify(possiblePlayers), {
    status: 200,
    headers: {
      'content-type': 'application/json',
    },
  });
}

interface ReqModel {
  id: string;
  tournament: TournamentModel;
}
