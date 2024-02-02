// import { db } from '@/lib/db';
// import {
//   players,
//   playersToTournaments,
//   tournaments,
// } from '@/lib/db/schema/tournaments';
// import { DeleteForm } from 'archive/tournament/delete-player';
// import { eq } from 'drizzle-orm';

// interface PlayersListProps {
//   tournamentId: string;
// }

// export default async function PlayersList({ tournamentId }: PlayersListProps) {
//   let participants = await db
//     .select()
//     .from(playersToTournaments)
//     .leftJoin(players, eq(playersToTournaments.player_id, players.id))
//     .leftJoin(
//       tournaments,
//       eq(playersToTournaments.tournament_id, tournaments.id),
//     )
//     .where(eq(tournaments.id, tournamentId))
//     .all();

//   return (
//     <main>
//       <h1 className="sr-only">players</h1>
//       <ul className="pt-4">
//         {participants.map((participant) => (
//           <li key={participant.player?.id}>
//             {participant.player?.name}
//             <DeleteForm
//               playerId={participant.player!.id}
//               name={participant.player?.name ?? participant.player!.nickname}
//               tournamentId={tournamentId}
//             />
//           </li>
//         ))}
//       </ul>
//     </main>
//   );
// }
