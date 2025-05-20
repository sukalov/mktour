'use server';

import { validateRequest } from '@/lib/auth/lucia';
import { db } from '@/lib/db';
import { getStatusInTournament } from '@/lib/db/queries/get-status-in-tournament';
import { clubs } from '@/lib/db/schema/clubs';
import {
  DatabasePlayer,
  InsertDatabasePlayer,
  players,
} from '@/lib/db/schema/players';
import {
  DatabasePlayerToTournament,
  DatabaseTournament,
  games,
  players_to_tournaments,
  tournaments,
} from '@/lib/db/schema/tournaments';
import { newid } from '@/lib/utils';
import { NewTournamentFormType } from '@/lib/zod/new-tournament-form';
import {
  GameModel,
  PlayerModel,
  Result,
  TournamentInfo,
} from '@/types/tournaments';
import { aliasedTable, and, eq, isNotNull, isNull, ne, sql } from 'drizzle-orm';
import { permanentRedirect } from 'next/navigation';

export const createTournament = async (
  values: Omit<NewTournamentFormType, 'date'> & {
    date: string;
  },
) => {
  const { user } = await validateRequest();
  if (!user) throw new Error('UNAUTHORIZED_REQUEST');
  const newTournamentID = newid();
  const newTournament: DatabaseTournament = {
    ...values,
    id: newTournamentID,
    created_at: new Date(),
    closed_at: null,
    started_at: null,
    rounds_number: null,
    ongoing_round: 1,
  };
  try {
    await db.insert(tournaments).values(newTournament);
  } catch (e) {
    throw new Error(`tournament has NOT been saved, ${e}`);
  }
  permanentRedirect(`/tournaments/${newTournamentID}`);
};

// moved to API endpoint
export async function getTournamentPlayers(
  id: string,
): Promise<Array<PlayerModel>> {
  const playersDb = await db
    .select()
    .from(players_to_tournaments)
    .where(eq(players_to_tournaments.tournament_id, id))
    .innerJoin(players, eq(players.id, players_to_tournaments.player_id));

  const playerModels = playersDb.map((each) => ({
    id: each.player.id,
    nickname: each.player.nickname,
    realname: each.player.realname,
    rating: each.player.rating,
    wins: each.players_to_tournaments.wins,
    draws: each.players_to_tournaments.draws,
    losses: each.players_to_tournaments.losses,
    color_index: each.players_to_tournaments.color_index,
    is_out: each.players_to_tournaments.is_out,
    place: each.players_to_tournaments.place,
  }));

  return playerModels.sort(
    (a, b) => b.wins + b.draws / 2 - (a.wins + a.draws / 2),
  );
}

// decided to keep using server action for this one not to face problems with dates serialization
export async function getTournamentInfo(id: string): Promise<TournamentInfo> {
  const tournamentInfo = (
    await db
      .select()
      .from(tournaments)
      .where(eq(tournaments.id, id))
      .innerJoin(clubs, eq(tournaments.club_id, clubs.id))
  ).at(0);
  if (!tournamentInfo) throw new Error('TOURNAMENT NOT FOUND');
  if (!tournamentInfo.club) throw new Error('ORGANIZER CLUB NOT FOUND');
  return tournamentInfo;
}

// moved to API endpoint
export async function getTournamentPossiblePlayers(
  id: string,
): Promise<Array<DatabasePlayer>> {
  const result = (await db.all(sql`
    SELECT p.*
    FROM ${players} p
    LEFT JOIN ${players_to_tournaments} pt
      ON p.id = pt.player_id AND pt.tournament_id = ${id}
    WHERE p.club_id = (
      SELECT t.club_id
      FROM ${tournaments} t
      WHERE t.id = ${id}
    )
    AND pt.player_id IS NULL;
  `)) as Array<DatabasePlayer>;
  return result;
}

export async function removePlayer({
  tournamentId,
  playerId,
  userId,
}: {
  tournamentId: string;
  playerId: string;
  userId: string;
}) {
  const { user } = await validateRequest();
  if (!user) throw new Error('UNAUTHORIZED_REQUEST');
  if (user.id !== userId) throw new Error('USER_NOT_MATCHING');

  await db
    .delete(players_to_tournaments)
    .where(
      and(
        eq(players_to_tournaments.player_id, playerId),
        eq(players_to_tournaments.tournament_id, tournamentId),
      ),
    );
}

export async function addNewPlayer({
  tournamentId,
  player,
  userId,
}: {
  tournamentId: string;
  player: InsertDatabasePlayer;
  userId: string;
}) {
  const { user } = await validateRequest();
  if (!user) throw new Error('UNAUTHORIZED_REQUEST');
  if (user.id !== userId) throw new Error('USER_NOT_MATCHING');
  const status = await getStatusInTournament(user, tournamentId);
  if (status === 'viewer') throw new Error('NOT_ADMIN');

  await db.insert(players).values(player);
  const playerToTournament: DatabasePlayerToTournament = {
    player_id: player.id,
    tournament_id: tournamentId,
    id: `${player.id}=${tournamentId}`,
    wins: 0,
    losses: 0,
    draws: 0,
    color_index: 0,
    place: null,
    is_out: null,
    pairing_number: null,
  };
  await db.insert(players_to_tournaments).values(playerToTournament);
}

// moved to API endpoint
export async function addExistingPlayer({
  tournamentId,
  player,
  userId,
}: {
  tournamentId: string;
  player: InsertDatabasePlayer;
  userId: string;
}) {
  const { user } = await validateRequest();
  if (!user) throw new Error('UNAUTHORIZED_REQUEST');
  if (user.id !== userId) throw new Error('USER_NOT_MATCHING');
  const status = await getStatusInTournament(user, tournamentId);
  if (status === 'viewer') throw new Error('NOT_ADMIN');

  const playerToTournament: DatabasePlayerToTournament = {
    player_id: player.id,
    tournament_id: tournamentId,
    id: `${player.id}=${tournamentId}`,
    wins: 0,
    losses: 0,
    draws: 0,
    color_index: 0,
    place: null,
    is_out: null,
    pairing_number: null,
  };
  await db.insert(players_to_tournaments).values(playerToTournament);
}

export async function getTournamentGames(
  tournamentId: string,
): Promise<GameModel[]> {
  console.log({ tournamentId });
  const whitePlayer = aliasedTable(players, 'white_player');
  const blackPlayer = aliasedTable(players, 'black_player');
  const gamesDb = await db
    .select({
      id: games.id,
      tournament_id: games.tournament_id,
      black_id: games.black_id,
      white_id: games.white_id,
      black_nickname: blackPlayer.nickname,
      white_nickname: whitePlayer.nickname,
      round_number: games.round_number,
      game_number: games.game_number,
      round_name: games.round_name || null,
      white_prev_game_id: games.white_prev_game_id || null,
      black_prev_game_id: games.black_prev_game_id || null,
      result: games.result || null,
    })
    .from(games)
    .where(eq(games.tournament_id, tournamentId))
    .innerJoin(whitePlayer, eq(games.black_id, whitePlayer.id))
    .innerJoin(blackPlayer, eq(games.white_id, blackPlayer.id));

  return gamesDb.sort((a, b) => a.game_number - b.game_number);
}

// moved to API endpoint
export async function getTournamentRoundGames({
  tournamentId,
  roundNumber,
}: {
  tournamentId: string;
  roundNumber: number;
}): Promise<GameModel[]> {
  const whitePlayer = aliasedTable(players, 'white_player');
  const blackPlayer = aliasedTable(players, 'black_player');
  const gamesDb = await db
    .select({
      id: games.id,
      tournament_id: games.tournament_id,
      black_id: games.black_id,
      white_id: games.white_id,
      black_nickname: blackPlayer.nickname,
      white_nickname: whitePlayer.nickname,
      round_number: games.round_number,
      game_number: games.game_number,
      round_name: games.round_name || null,
      white_prev_game_id: games.white_prev_game_id || null,
      black_prev_game_id: games.black_prev_game_id || null,
      result: games.result || null,
    })
    .from(games)
    .where(
      and(
        eq(games.tournament_id, tournamentId),
        eq(games.round_number, roundNumber),
      ),
    )
    .innerJoin(whitePlayer, eq(games.white_id, whitePlayer.id))
    .innerJoin(blackPlayer, eq(games.black_id, blackPlayer.id));

  return gamesDb.sort((a, b) => a.game_number - b.game_number);
}

// export async function generateRoundRobinRound({
//   tournamentId,
//   roundNumber,
//   userId,
// }: {
//   tournamentId: string;
//   roundNumber: number;
//   userId: string;
// }): Promise<GameModel[]> {
//   const { user } = await validateRequest();
//   if (!user) throw new Error('UNAUTHORIZED_REQUEST');
//   if (user.id !== userId) throw new Error('USER_NOT_MATCHING');

//   const tournament = (
//     await db.select().from(tournaments).where(eq(tournaments.id, tournamentId))
//   ).at(0);

//   if (tournament?.started_at) {
//     const roundGames = await db
//       .select()
//       .from(games)
//       .where(
//         and(
//           eq(games.tournament_id, tournamentId),
//           eq(games.round_number, roundNumber),
//         ),
//       );
//     if (roundGames.length > 0) {
//       for (let game in roundGames) {
//         if (roundGames[game].result) throw new Error('RESULTS_PRESENT');
//       }
//     }
//   }

//   await db
//     .delete(games)
//     .where(
//       and(
//         eq(games.tournament_id, tournamentId),
//         eq(games.round_number, roundNumber),
//       ),
//     );

//   const roundGames = await generateRoundRobinRoundFunction({
//     tournamentId,
//     roundNumber,
//   });

//   let playerIds: string[] = [];
//   roundGames.forEach((game) => {
//     playerIds.push(game.white_id);
//     playerIds.push(game.black_id);
//   });
//   const tournamentPlayers = await db
//     .select()
//     .from(players)
//     .where(inArray(players.id, playerIds));

//   return roundGames.map((game) => ({
//     white_nickname: tournamentPlayers.find(
//       (player) => player.id === game.white_id,
//     )!.nickname,
//     black_nickname: tournamentPlayers.find(
//       (player) => player.id === game.black_id,
//     )!.nickname,
//     id: game.id,
//     round_number: game.round_number,
//     white_id: game.white_id,
//     black_id: game.black_id,
//     tournament_id: game.tournament_id,
//     round_name: game.round_name || null,
//     white_prev_game_id: game.white_prev_game_id || null,
//     black_prev_game_id: game.black_prev_game_id || null,
//     result: game.result || null,
//   }));
// }

export async function saveRound({
  tournamentId,
  roundNumber,
  newGames,
}: {
  tournamentId: string;
  roundNumber: number;
  newGames: GameModel[];
}) {
  const { user } = await validateRequest();
  if (!user) throw new Error('UNAUTHORIZED_REQUEST');
  const status = await getStatusInTournament(user, tournamentId);
  if (status === 'viewer') throw new Error('NOT_ADMIN');
  const cleanupPromises = [
    db
      .delete(games)
      .where(
        and(
          eq(games.tournament_id, tournamentId),
          eq(games.round_number, roundNumber),
        ),
      ),
    db
      .update(tournaments)
      .set({ ongoing_round: roundNumber })
      .where(eq(tournaments.id, tournamentId)),
  ];

  await Promise.all(cleanupPromises);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const insertPromises: Promise<any>[] = []; // FIXME any
  newGames.forEach((game) => {
    const { ...newGame } = game;
    insertPromises.push(db.insert(games).values(newGame));
  });

  await Promise.all(insertPromises);
}

export async function startTournament({
  tournamentId,
  started_at,
  rounds_number,
}: {
  tournamentId: string;
  started_at: Date;
  rounds_number: number;
}) {
  const { user } = await validateRequest();
  if (!user) throw new Error('UNAUTHORIZED_REQUEST');
  const status = await getStatusInTournament(user, tournamentId);
  if (status === 'viewer') throw new Error('NOT_ADMIN');
  if (started_at)
    await db
      .update(tournaments)
      .set({ started_at, rounds_number })
      .where(
        and(eq(tournaments.id, tournamentId), isNull(tournaments.started_at)),
      )
      .then((value) => {
        if (!value.rowsAffected) throw new Error('TOURNAMENT_ALREADY_GOING');
      });
}

export async function resetTournament({
  tournamentId,
}: {
  tournamentId: string;
}) {
  const { user } = await validateRequest();
  if (!user) throw new Error('UNAUTHORIZED_REQUEST');
  const status = await getStatusInTournament(user, tournamentId);
  if (status === 'viewer') throw new Error('NOT_ADMIN');
  const queries = [
    db
      .update(tournaments)
      .set({ started_at: null, ongoing_round: 1, closed_at: null })
      .where(
        and(
          eq(tournaments.id, tournamentId),
          isNotNull(tournaments.started_at),
        ),
      )
      .then((value) => {
        if (!value.rowsAffected) throw new Error('TOURNAMENT_ALREADY_RESET');
      }),

    db
      .delete(games)
      .where(
        and(eq(games.tournament_id, tournamentId), ne(games.round_number, 1)),
      ),
    db
      .update(players_to_tournaments)
      .set({
        wins: 0,
        draws: 0,
        losses: 0,
        color_index: 0,
        place: null,
      })
      .where(eq(players_to_tournaments.tournament_id, tournamentId)),
  ];
  await Promise.all(queries);
  await db
    .update(games)
    .set({ result: null })
    .where(eq(games.tournament_id, tournamentId));
}

export async function setTournamentGameResult({
  gameId,
  whiteId,
  blackId,
  result,
  prevResult,
  tournamentId,
}: {
  tournamentId: string;
  gameId: string;
  whiteId: string;
  blackId: string;
  result: Result;
  prevResult: Result | null;
  roundNumber: number;
}) {
  const { user } = await validateRequest();
  if (!user) throw new Error('UNAUTHORIZED_REQUEST');
  const status = await getStatusInTournament(user, tournamentId);
  if (status === 'viewer') throw new Error('NOT_ADMIN');
  const tournament = (
    await db.select().from(tournaments).where(eq(tournaments.id, tournamentId))
  ).at(0);
  if (tournament?.started_at === null) return 'TOURNAMENT_NOT_STARTED';
  if (result === prevResult) {
    await Promise.all([
      handleResultReset(whiteId, blackId, tournamentId, prevResult),
      db.update(games).set({ result: null }).where(eq(games.id, gameId)),
    ]);
    return;
  }
  let handler;
  if (result === '1-0') {
    handler = handleWhiteWin(whiteId, blackId, tournamentId, prevResult);
  }
  if (result === '0-1') {
    handler = handleBlackWin(whiteId, blackId, tournamentId, prevResult);
  }
  if (result === '1/2-1/2') {
    handler = handleDraw(whiteId, blackId, tournamentId, prevResult);
  }
  await Promise.all([
    handler,
    db.update(games).set({ result }).where(eq(games.id, gameId)),
  ]);
}

async function handleWhiteWin(
  whiteId: string,
  blackId: string,
  tournamentId: string,
  prevResult?: Result | null,
) {
  if (!prevResult) {
    await Promise.all([
      db
        .update(players_to_tournaments)
        .set({
          wins: sql`COALESCE(${players_to_tournaments.wins}, 0) + 1`,
          color_index: sql`COALESCE(${players_to_tournaments.color_index}, 0) + 1`,
        })
        .where(
          and(
            eq(players_to_tournaments.tournament_id, tournamentId),
            eq(players_to_tournaments.player_id, whiteId),
          ),
        ),
      db
        .update(players_to_tournaments)
        .set({ losses: sql`COALESCE(${players_to_tournaments.losses}, 0) + 1` })
        .where(
          and(
            eq(players_to_tournaments.tournament_id, tournamentId),
            eq(players_to_tournaments.player_id, blackId),
          ),
        ),
    ]);
  }
  if (prevResult === '0-1') {
    await Promise.all([
      db
        .update(players_to_tournaments)
        .set({
          wins: sql`COALESCE(${players_to_tournaments.wins}, 0) + 1`,
          losses: sql`COALESCE(${players_to_tournaments.losses}, 0) - 1`,
        })
        .where(
          and(
            eq(players_to_tournaments.tournament_id, tournamentId),
            eq(players_to_tournaments.player_id, whiteId),
          ),
        ),
      db
        .update(players_to_tournaments)
        .set({
          wins: sql`COALESCE(${players_to_tournaments.wins}, 0) - 1`,
          losses: sql`COALESCE(${players_to_tournaments.losses}, 0) + 1`,
        })
        .where(
          and(
            eq(players_to_tournaments.tournament_id, tournamentId),
            eq(players_to_tournaments.player_id, blackId),
          ),
        ),
    ]);
  }
  if (prevResult === '1/2-1/2') {
    await Promise.all([
      db
        .update(players_to_tournaments)
        .set({
          wins: sql`COALESCE(${players_to_tournaments.wins}, 0) + 1`,
          draws: sql`COALESCE(${players_to_tournaments.draws}, 0) - 1`,
        })
        .where(
          and(
            eq(players_to_tournaments.tournament_id, tournamentId),
            eq(players_to_tournaments.player_id, whiteId),
          ),
        ),
      db
        .update(players_to_tournaments)
        .set({
          draws: sql`COALESCE(${players_to_tournaments.draws}, 0) - 1`,
          losses: sql`COALESCE(${players_to_tournaments.losses}, 0) + 1`,
        })
        .where(
          and(
            eq(players_to_tournaments.tournament_id, tournamentId),
            eq(players_to_tournaments.player_id, blackId),
          ),
        ),
    ]);
  }
}

async function handleBlackWin(
  whiteId: string,
  blackId: string,
  tournamentId: string,
  prevResult?: Result | null,
) {
  if (!prevResult) {
    await Promise.all([
      db
        .update(players_to_tournaments)
        .set({
          losses: sql`COALESCE(${players_to_tournaments.losses}, 0) + 1`,
          color_index: sql`COALESCE(${players_to_tournaments.color_index}, 0) + 1`,
        })
        .where(
          and(
            eq(players_to_tournaments.tournament_id, tournamentId),
            eq(players_to_tournaments.player_id, whiteId),
          ),
        ),
      db
        .update(players_to_tournaments)
        .set({ wins: sql`COALESCE(${players_to_tournaments.wins}, 0) + 1` })
        .where(
          and(
            eq(players_to_tournaments.tournament_id, tournamentId),
            eq(players_to_tournaments.player_id, blackId),
          ),
        ),
    ]);
  }
  if (prevResult === '1-0') {
    await Promise.all([
      db
        .update(players_to_tournaments)
        .set({
          wins: sql`COALESCE(${players_to_tournaments.wins}, 0) - 1`,
          losses: sql`COALESCE(${players_to_tournaments.losses}, 0) + 1`,
        })
        .where(
          and(
            eq(players_to_tournaments.tournament_id, tournamentId),
            eq(players_to_tournaments.player_id, whiteId),
          ),
        ),
      db
        .update(players_to_tournaments)
        .set({
          wins: sql`COALESCE(${players_to_tournaments.wins}, 0) + 1`,
          losses: sql`COALESCE(${players_to_tournaments.losses}, 0) - 1`,
        })
        .where(
          and(
            eq(players_to_tournaments.tournament_id, tournamentId),
            eq(players_to_tournaments.player_id, blackId),
          ),
        ),
    ]);
  }
  if (prevResult === '1/2-1/2') {
    await Promise.all([
      db
        .update(players_to_tournaments)
        .set({
          draws: sql`COALESCE(${players_to_tournaments.draws}, 0) - 1`,
          losses: sql`COALESCE(${players_to_tournaments.losses}, 0) + 1`,
        })
        .where(
          and(
            eq(players_to_tournaments.tournament_id, tournamentId),
            eq(players_to_tournaments.player_id, whiteId),
          ),
        ),
      db
        .update(players_to_tournaments)
        .set({
          wins: sql`COALESCE(${players_to_tournaments.wins}, 0) + 1`,
          draws: sql`COALESCE(${players_to_tournaments.draws}, 0) - 1`,
        })
        .where(
          and(
            eq(players_to_tournaments.tournament_id, tournamentId),
            eq(players_to_tournaments.player_id, blackId),
          ),
        ),
    ]);
  }
}

async function handleDraw(
  whiteId: string,
  blackId: string,
  tournamentId: string,
  prevResult?: Result | null,
) {
  if (!prevResult) {
    await Promise.all([
      db
        .update(players_to_tournaments)
        .set({
          draws: sql`COALESCE(${players_to_tournaments.draws}, 0) + 1`,
          color_index: sql`COALESCE(${players_to_tournaments.color_index}, 0) + 1`,
        })
        .where(
          and(
            eq(players_to_tournaments.tournament_id, tournamentId),
            eq(players_to_tournaments.player_id, whiteId),
          ),
        ),
      db
        .update(players_to_tournaments)
        .set({ draws: sql`COALESCE(${players_to_tournaments.draws}, 0) + 1` })
        .where(
          and(
            eq(players_to_tournaments.tournament_id, tournamentId),
            eq(players_to_tournaments.player_id, blackId),
          ),
        ),
    ]);
  }
  if (prevResult === '1-0') {
    await Promise.all([
      db
        .update(players_to_tournaments)
        .set({
          draws: sql`COALESCE(${players_to_tournaments.draws}, 0) + 1`,
          wins: sql`COALESCE(${players_to_tournaments.wins}, 0) - 1`,
        })
        .where(
          and(
            eq(players_to_tournaments.tournament_id, tournamentId),
            eq(players_to_tournaments.player_id, whiteId),
          ),
        ),
      db
        .update(players_to_tournaments)
        .set({
          draws: sql`COALESCE(${players_to_tournaments.draws}, 0) + 1`,
          losses: sql`COALESCE(${players_to_tournaments.losses}, 0) - 1`,
        })
        .where(
          and(
            eq(players_to_tournaments.tournament_id, tournamentId),
            eq(players_to_tournaments.player_id, blackId),
          ),
        ),
    ]);
  }
  if (prevResult === '0-1') {
    await Promise.all([
      db
        .update(players_to_tournaments)
        .set({
          draws: sql`COALESCE(${players_to_tournaments.draws}, 0) + 1`,
          losses: sql`COALESCE(${players_to_tournaments.losses}, 0) - 1`,
        })
        .where(
          and(
            eq(players_to_tournaments.tournament_id, tournamentId),
            eq(players_to_tournaments.player_id, whiteId),
          ),
        ),
      db
        .update(players_to_tournaments)
        .set({
          draws: sql`COALESCE(${players_to_tournaments.draws}, 0) + 1`,
          wins: sql`COALESCE(${players_to_tournaments.wins}, 0) - 1`,
        })
        .where(
          and(
            eq(players_to_tournaments.tournament_id, tournamentId),
            eq(players_to_tournaments.player_id, blackId),
          ),
        ),
    ]);
  }
}

async function handleResultReset(
  whiteId: string,
  blackId: string,
  tournamentId: string,
  prevResult: Result,
) {
  if (prevResult === '1-0') {
    await Promise.all([
      db
        .update(players_to_tournaments)
        .set({
          wins: sql`COALESCE(${players_to_tournaments.wins}, 0) - 1`,
          color_index: sql`COALESCE(${players_to_tournaments.color_index}, 0) - 1`,
        })
        .where(
          and(
            eq(players_to_tournaments.tournament_id, tournamentId),
            eq(players_to_tournaments.player_id, whiteId),
          ),
        ),
      db
        .update(players_to_tournaments)
        .set({
          losses: sql`COALESCE(${players_to_tournaments.losses}, 0) - 1`,
        })
        .where(
          and(
            eq(players_to_tournaments.tournament_id, tournamentId),
            eq(players_to_tournaments.player_id, blackId),
          ),
        ),
    ]);
  }
  if (prevResult === '0-1') {
    await Promise.all([
      db
        .update(players_to_tournaments)
        .set({
          losses: sql`COALESCE(${players_to_tournaments.losses}, 0) - 1`,
          color_index: sql`COALESCE(${players_to_tournaments.color_index}, 0) - 1`,
        })
        .where(
          and(
            eq(players_to_tournaments.tournament_id, tournamentId),
            eq(players_to_tournaments.player_id, whiteId),
          ),
        ),
      db
        .update(players_to_tournaments)
        .set({
          wins: sql`COALESCE(${players_to_tournaments.wins}, 0) - 1`,
        })
        .where(
          and(
            eq(players_to_tournaments.tournament_id, tournamentId),
            eq(players_to_tournaments.player_id, blackId),
          ),
        ),
    ]);
  }
  if (prevResult === '1/2-1/2') {
    await Promise.all([
      db
        .update(players_to_tournaments)
        .set({
          draws: sql`COALESCE(${players_to_tournaments.draws}, 0) - 1`,
          color_index: sql`COALESCE(${players_to_tournaments.color_index}, 0) - 1`,
        })
        .where(
          and(
            eq(players_to_tournaments.tournament_id, tournamentId),
            eq(players_to_tournaments.player_id, whiteId),
          ),
        ),
      db
        .update(players_to_tournaments)
        .set({
          draws: sql`COALESCE(${players_to_tournaments.draws}, 0) - 1`,
        })
        .where(
          and(
            eq(players_to_tournaments.tournament_id, tournamentId),
            eq(players_to_tournaments.player_id, blackId),
          ),
        ),
    ]);
  }
  return 'RESULT_RESET';
}

export async function finishTournament({
  tournamentId,
  closed_at,
}: {
  tournamentId: string;
  closed_at: Date;
}) {
  const { user } = await validateRequest();
  if (!user) throw new Error('UNAUTHORIZED_REQUEST');

  const status = await getStatusInTournament(user, tournamentId);
  if (status === 'viewer') throw new Error('NOT_ADMIN');

  if (closed_at) {
    await db
      .update(tournaments)
      .set({ closed_at })
      .where(
        and(eq(tournaments.id, tournamentId), isNull(tournaments.closed_at)),
      )
      .then((value) => {
        if (!value.rowsAffected) throw new Error('TOURNAMENT_ALREADY_FINISHED');
      });
  }

  //// NB following block is chatGPT generated and needs review:
  const players = await getTournamentPlayers(tournamentId);
  let counter = 1;
  players.forEach((player, i) => {
    const playerScore = player.wins + player.draws / 2;
    if (i === 0) {
      player.place = counter;
      counter++;
    } else {
      const prevPlayerScore = players[i - 1].wins + players[i - 1].draws / 2;
      if (playerScore === prevPlayerScore) {
        player.place = counter - 1;
      } else {
        player.place = counter;
        counter++;
      }
    }
  });
  const updates = players.map((player) =>
    db
      .update(players_to_tournaments)
      .set({ place: player.place })
      .where(
        and(
          eq(players_to_tournaments.tournament_id, tournamentId),
          eq(players_to_tournaments.player_id, player.id),
        ),
      ),
  );
  await Promise.all(updates);
}

export async function deleteTournament({
  tournamentId,
}: {
  tournamentId: string;
}) {
  const { user } = await validateRequest();
  if (!user) throw new Error('UNAUTHORIZED_REQUEST');
  const status = await getStatusInTournament(user, tournamentId);
  if (status === 'viewer') throw new Error('NOT_ADMIN');
  const queries = [
    db.delete(games).where(eq(games.tournament_id, tournamentId)),
    db
      .delete(players_to_tournaments)
      .where(eq(players_to_tournaments.tournament_id, tournamentId)),
  ];
  await Promise.all(queries);
  await db.delete(tournaments).where(eq(tournaments.id, tournamentId));
  permanentRedirect('/tournaments/my');
}

export async function resetTournamentPlayers({
  tournamentId,
}: {
  tournamentId: string;
}) {
  await db
    .delete(players_to_tournaments)
    .where(eq(players_to_tournaments.tournament_id, tournamentId));
}
