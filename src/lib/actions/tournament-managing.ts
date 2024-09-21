'use server';

import { generateRoundRobinRoundFunction } from '@/lib/actions/bracket-generation';
import { validateRequest } from '@/lib/auth/lucia';
import { db } from '@/lib/db';
import {
  DatabasePlayer,
  DatabasePlayerToTournament,
  DatabaseTournament,
  clubs,
  games,
  players,
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
import { aliasedTable, and, eq, inArray, isNotNull, isNull, sql } from 'drizzle-orm';
import { redirect } from 'next/navigation';

export const createTournament = async (values: NewTournamentFormType) => {
  const { user } = await validateRequest();
  if (!user) throw new Error('UNAUTHORIZED_REQUEST');
  const newTournamentID = newid();
  const newTournament: DatabaseTournament = {
    ...values,
    date: new Date(values.date).toISOString().slice(0, 10),
    id: newTournamentID,
    created_at: new Date(),
    closed_at: null,
    started_at: null,
    club_id: values.club_id,
    rounds_number: null,
    ongoing_round: 1,
    rated: values.rated,
  };
  try {
    await db.insert(tournaments).values(newTournament);
  } catch (e) {
    throw new Error('tournament has NOT been saved');
  }
  redirect(`/tournaments/${newTournamentID}`);
};

export async function getTournamentPlayers(
  id: string,
): Promise<Array<PlayerModel>> {
  const playersDb = await db
    .select()
    .from(players_to_tournaments)
    .where(eq(players_to_tournaments.tournament_id, id))
    .leftJoin(players, eq(players.id, players_to_tournaments.player_id));

  const playerModels = playersDb.map((each) => ({
    id: each.player!.id,
    nickname: each.player!.nickname,
    realname: each.player?.realname,
    rating: each.player!.rating,
    wins: each.players_to_tournaments.wins,
    draws: each.players_to_tournaments.draws,
    losses: each.players_to_tournaments.losses,
    color_index: each.players_to_tournaments.color_index,
    exited: each.players_to_tournaments.exited,
    place: each.players_to_tournaments.place,
  }));

  return playerModels.sort(
    (a, b) => b.wins + b.draws / 2 - (a.wins + a.draws / 2),
  );
}

export async function getTournamentInfo(id: string): Promise<TournamentInfo> {
  const tournamentInfo = (
    await db
      .select()
      .from(tournaments)
      .where(eq(tournaments.id, id))
      .leftJoin(clubs, eq(tournaments.club_id, clubs.id))
  ).at(0);
  if (!tournamentInfo) throw new Error('TOURNAMENT NOT FOUND');
  if (!tournamentInfo.club) throw new Error('ORGANIZER CLUB NOT FOUND');
  return tournamentInfo;
}

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
  player: DatabasePlayer;
  userId: string;
}) {
  const { user } = await validateRequest();
  if (!user) throw new Error('UNAUTHORIZED_REQUEST');
  if (user.id !== userId) throw new Error('USER_NOT_MATCHING');

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
    exited: null,
  };
  await db.insert(players_to_tournaments).values(playerToTournament);
}

export async function addExistingPlayer({
  tournamentId,
  player,
  userId,
}: {
  tournamentId: string;
  player: DatabasePlayer;
  userId: string;
}) {
  const { user } = await validateRequest();
  if (!user) throw new Error('UNAUTHORIZED_REQUEST');
  if (user.id !== userId) throw new Error('USER_NOT_MATCHING');

  const playerToTournament: DatabasePlayerToTournament = {
    player_id: player.id,
    tournament_id: tournamentId,
    id: `${player.id}=${tournamentId}`,
    wins: 0,
    losses: 0,
    draws: 0,
    color_index: 0,
    place: null,
    exited: null,
  };
  await db.insert(players_to_tournaments).values(playerToTournament);
}

export async function getTournamentGames(
  tournamentId: string,
): Promise<GameModel[]> {
  const whitePlayer = aliasedTable(players, 'white_player');
  const blackPlayer = aliasedTable(players, 'black_player');
  return await db
    .select({
      id: games.id,
      tournament_id: games.tournament_id,
      black_id: games.black_id,
      white_id: games.white_id,
      black_nickname: blackPlayer.nickname,
      white_nickname: whitePlayer.nickname,
      round_number: games.round_number,
      round_name: games.round_name || null,
      white_prev_game_id: games.white_prev_game_id || null,
      black_prev_game_id: games.black_prev_game_id || null,
      result: games.result || null,
    })
    .from(games)
    .where(eq(games.tournament_id, tournamentId))
    .leftJoin(whitePlayer, eq(games.black_id, whitePlayer.id))
    .leftJoin(blackPlayer, eq(games.white_id, blackPlayer.id));
}

export async function getTournamentRoundGames({
  tournamentId,
  roundNumber,
}: {
  tournamentId: string;
  roundNumber: number;
}): Promise<GameModel[]> {
  const whitePlayer = aliasedTable(players, 'white_player');
  const blackPlayer = aliasedTable(players, 'black_player');
  return await db
    .select({
      id: games.id,
      tournament_id: games.tournament_id,
      black_id: games.black_id,
      white_id: games.white_id,
      black_nickname: blackPlayer.nickname,
      white_nickname: whitePlayer.nickname,
      round_number: games.round_number,
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
    .leftJoin(whitePlayer, eq(games.white_id, whitePlayer.id))
    .leftJoin(blackPlayer, eq(games.black_id, blackPlayer.id));
}

export async function generateRoundRobinRound({
  tournamentId,
  roundNumber,
  userId,
}: {
  tournamentId: string;
  roundNumber: number;
  userId: string;
}): Promise<GameModel[]> {
  const { user } = await validateRequest();
  if (!user) throw new Error('UNAUTHORIZED_REQUEST');
  if (user.id !== userId) throw new Error('USER_NOT_MATCHING');

  const tournament = (
    await db.select().from(tournaments).where(eq(tournaments.id, tournamentId))
  ).at(0);

  if (tournament?.started_at) {
    const roundGames = await db
      .select()
      .from(games)
      .where(
        and(
          eq(games.tournament_id, tournamentId),
          eq(games.round_number, roundNumber),
        ),
      );
    if (roundGames.length > 0) {
      for (let game in roundGames) {
        if (roundGames[game].result) throw new Error('RESULTS_PRESENT');
      }
    }
  }

  await db
    .delete(games)
    .where(
      and(
        eq(games.tournament_id, tournamentId),
        eq(games.round_number, roundNumber),
      ),
    );

  const roundGames = await generateRoundRobinRoundFunction({
    tournamentId,
    roundNumber,
  });

  let playerIds: string[] = [];
  roundGames.forEach((game) => {
    playerIds.push(game.white_id);
    playerIds.push(game.black_id);
  });
  const tournamentPlayers = await db
    .select()
    .from(players)
    .where(inArray(players.id, playerIds));

  return roundGames.map((game) => ({
    white_nickname: tournamentPlayers.find(
      (player) => player.id === game.white_id,
    )!.nickname,
    black_nickname: tournamentPlayers.find(
      (player) => player.id === game.black_id,
    )!.nickname,
    id: game.id,
    round_number: game.round_number,
    white_id: game.white_id,
    black_id: game.black_id,
    tournament_id: game.tournament_id,
    round_name: game.round_name || null,
    white_prev_game_id: game.white_prev_game_id || null,
    black_prev_game_id: game.black_prev_game_id || null,
    result: game.result || null,
  }));
}

export async function startTournament({
  tournamentId,
  started_at,
}: {
  tournamentId: string;
  started_at: Date;
}) {
  const { user } = await validateRequest();
  if (!user) throw new Error('UNAUTHORIZED_REQUEST') // FIXME ADD STATUS IN TOURNAMENT CHECK
  if (started_at)
    await db
      .update(tournaments)
      .set({ started_at })
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
      if (!user) throw new Error('UNAUTHORIZED_REQUEST') // FIXME ADD STATUS-IN-TOURNAMENT CHECK
        await db
          .update(tournaments)
          .set({ started_at: null })
          .where(
            and(eq(tournaments.id, tournamentId), isNotNull(tournaments.started_at)),
          )
          .then((value) => {
            if (!value.rowsAffected) throw new Error('TOURNAMENT_ALREADY_RESET');
          });
        }

export async function setTournamentGameResult({
  gameId,
  whiteId,
  blackId,
  result,
  prevResult,
}: {
  gameId: string;
  whiteId: string;
  blackId: string;
  result: Result;
  prevResult: Result | null;
}) {
  if (prevResult && result === prevResult) {
    await handleResultReset(whiteId, blackId, prevResult);
    await db.update(games).set({ result: null }).where(eq(games.id, gameId)); // maybe use 'delete' instead of 'set'?
    return;
  }
  if (result === '1-0') {
    handleWhiteWin(whiteId, blackId, prevResult);
  }
  if (result === '0-1') {
    handleBlackWin(whiteId, blackId, prevResult);
  }
  if (result === '1/2-1/2') {
    handleDraw(whiteId, blackId, prevResult);
  }
  await db.update(games).set({ result }).where(eq(games.id, gameId));
}

async function handleWhiteWin(
  whiteId: string,
  blackId: string,
  prevResult?: Result | null,
) {
  if (!prevResult) {
    await db
      .update(players_to_tournaments)
      .set({ wins: sql`COALESCE(${players_to_tournaments.wins}, 0) + 1` })
      .where(eq(players_to_tournaments.player_id, whiteId));
    await db
      .update(players_to_tournaments)
      .set({ losses: sql`COALESCE(${players_to_tournaments.losses}, 0) + 1` })
      .where(eq(players_to_tournaments.player_id, blackId));
  }
  if (prevResult === '0-1') {
    await db
      .update(players_to_tournaments)
      .set({
        wins: sql`COALESCE(${players_to_tournaments.wins}, 0) + 1`,
        losses: sql`COALESCE(${players_to_tournaments.losses}, 0) - 1`,
      })
      .where(eq(players_to_tournaments.player_id, whiteId));
    await db
      .update(players_to_tournaments)
      .set({
        wins: sql`COALESCE(${players_to_tournaments.wins}, 0) - 1`,
        losses: sql`COALESCE(${players_to_tournaments.losses}, 0) + 1`,
      })
      .where(eq(players_to_tournaments.player_id, blackId));
  }
  if (prevResult === '1/2-1/2') {
    await db
      .update(players_to_tournaments)
      .set({
        wins: sql`COALESCE(${players_to_tournaments.wins}, 0) + 1`,
        draws: sql`COALESCE(${players_to_tournaments.draws}, 0) - 1`,
      })
      .where(eq(players_to_tournaments.player_id, whiteId));
    await db
      .update(players_to_tournaments)
      .set({
        draws: sql`COALESCE(${players_to_tournaments.draws}, 0) - 1`,
        losses: sql`COALESCE(${players_to_tournaments.losses}, 0) + 1`,
      })
      .where(eq(players_to_tournaments.player_id, blackId));
  }
}

async function handleBlackWin(
  whiteId: string,
  blackId: string,
  prevResult?: Result | null,
) {
  if (!prevResult) {
    await db
      .update(players_to_tournaments)
      .set({ losses: sql`COALESCE(${players_to_tournaments.losses}, 0) + 1` })
      .where(eq(players_to_tournaments.player_id, whiteId));
    await db
      .update(players_to_tournaments)
      .set({ wins: sql`COALESCE(${players_to_tournaments.wins}, 0) + 1` })
      .where(eq(players_to_tournaments.player_id, blackId));
  }
  if (prevResult === '1-0') {
    await db
      .update(players_to_tournaments)
      .set({
        wins: sql`COALESCE(${players_to_tournaments.wins}, 0) - 1`,
        losses: sql`COALESCE(${players_to_tournaments.losses}, 0) + 1`,
      })
      .where(eq(players_to_tournaments.player_id, whiteId));
    await db
      .update(players_to_tournaments)
      .set({
        wins: sql`COALESCE(${players_to_tournaments.wins}, 0) + 1`,
        losses: sql`COALESCE(${players_to_tournaments.losses}, 0) - 1`,
      })
      .where(eq(players_to_tournaments.player_id, blackId));
  }
  if (prevResult === '1/2-1/2') {
    await db
      .update(players_to_tournaments)
      .set({
        draws: sql`COALESCE(${players_to_tournaments.draws}, 0) - 1`,
        losses: sql`COALESCE(${players_to_tournaments.losses}, 0) + 1`,
      })
      .where(eq(players_to_tournaments.player_id, whiteId));
    await db
      .update(players_to_tournaments)
      .set({
        wins: sql`COALESCE(${players_to_tournaments.wins}, 0) + 1`,
        draws: sql`COALESCE(${players_to_tournaments.draws}, 0) - 1`,
      })
      .where(eq(players_to_tournaments.player_id, blackId));
  }
}

async function handleDraw(
  whiteId: string,
  blackId: string,
  prevResult?: Result | null,
) {
  if (!prevResult) {
    await db
      .update(players_to_tournaments)
      .set({ draws: sql`COALESCE(${players_to_tournaments.draws}, 0) + 1` })
      .where(eq(players_to_tournaments.player_id, whiteId));
    await db
      .update(players_to_tournaments)
      .set({ draws: sql`COALESCE(${players_to_tournaments.draws}, 0) + 1` })
      .where(eq(players_to_tournaments.player_id, blackId));
  }
  if (prevResult === '1-0') {
    await db
      .update(players_to_tournaments)
      .set({
        draws: sql`COALESCE(${players_to_tournaments.draws}, 0) + 1`,
        wins: sql`COALESCE(${players_to_tournaments.wins}, 0) - 1`,
      })
      .where(eq(players_to_tournaments.player_id, whiteId));
    await db
      .update(players_to_tournaments)
      .set({
        draws: sql`COALESCE(${players_to_tournaments.draws}, 0) + 1`,
        losses: sql`COALESCE(${players_to_tournaments.losses}, 0) - 1`,
      })
      .where(eq(players_to_tournaments.player_id, blackId));
  }
  if (prevResult === '0-1') {
    await db
      .update(players_to_tournaments)
      .set({
        draws: sql`COALESCE(${players_to_tournaments.draws}, 0) + 1`,
        losses: sql`COALESCE(${players_to_tournaments.losses}, 0) - 1`,
      })
      .where(eq(players_to_tournaments.player_id, whiteId));
    await db
      .update(players_to_tournaments)
      .set({
        draws: sql`COALESCE(${players_to_tournaments.draws}, 0) + 1`,
        wins: sql`COALESCE(${players_to_tournaments.wins}, 0) - 1`,
      })
      .where(eq(players_to_tournaments.player_id, blackId));
  }
}

async function handleResultReset(
  whiteId: string,
  blackId: string,
  prevResult: Result,
) {
  if (prevResult === '1-0') {
    await db
      .update(players_to_tournaments)
      .set({
        wins: sql`COALESCE(${players_to_tournaments.wins}, 0) - 1`,
      })
      .where(eq(players_to_tournaments.player_id, whiteId));
    await db
      .update(players_to_tournaments)
      .set({
        losses: sql`COALESCE(${players_to_tournaments.losses}, 0) - 1`,
      })
      .where(eq(players_to_tournaments.player_id, blackId));
  }
  if (prevResult === '0-1') {
    await db
      .update(players_to_tournaments)
      .set({
        losses: sql`COALESCE(${players_to_tournaments.losses}, 0) - 1`,
      })
      .where(eq(players_to_tournaments.player_id, whiteId));
    await db
      .update(players_to_tournaments)
      .set({
        wins: sql`COALESCE(${players_to_tournaments.wins}, 0) - 1`,
      })
      .where(eq(players_to_tournaments.player_id, blackId));
  }
  if (prevResult === '1/2-1/2') {
    await db
      .update(players_to_tournaments)
      .set({
        draws: sql`COALESCE(${players_to_tournaments.draws}, 0) - 1`,
      })
      .where(eq(players_to_tournaments.player_id, whiteId));
    await db
      .update(players_to_tournaments)
      .set({
        draws: sql`COALESCE(${players_to_tournaments.draws}, 0) - 1`,
      })
      .where(eq(players_to_tournaments.player_id, blackId));
  }
}
