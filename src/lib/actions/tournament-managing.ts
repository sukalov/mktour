'use server';

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
import { PlayerModel } from '@/types/tournaments';
import { aliasedTable, and, eq, sql } from 'drizzle-orm';
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

  return playersDb.map((each) => ({
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
}

export async function getTournamentInfo(id: string) {
  return (
    await db
      .select()
      .from(tournaments)
      .where(eq(tournaments.id, id))
      .leftJoin(clubs, eq(tournaments.club_id, clubs.id))
  ).at(0);
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

export interface GameModel {
  id: string;
  black_id: string;
  white_id: string;
  black_nickname: string;
  white_nickname: string;
  black_prev_game_id: string | null;
  white_prev_game_id: string | null;
  round_number: number;
  round_name: string | null;
  result: string | null;
}

export async function getTournamentGames() {
  const whitePlayer = aliasedTable(players, 'white_player');
  const blackPlayer = aliasedTable(players, 'black_player');
  const res =  await db.select({
    id: games.id,
    black_id: games.black_id,
    white_id: games.white_id,
    black_nickname: blackPlayer.nickname,
    white_nickname: whitePlayer.nickname,
    black_prev_game_id: games.black_prev_game_id,
    white_prev_game_id: games.white_prev_game_id,
    round_number: games.round_number,
    round_name: games.round_name,
    result: games.result,
  })
  .from(games)
  .leftJoin(whitePlayer, eq(games.black_id, whitePlayer.id))
  .leftJoin(blackPlayer, eq(games.white_id, blackPlayer.id));
  
  return res
};
