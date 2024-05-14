'use server';

import { db } from '@/lib/db';
import {
  DatabaseGame,
  clubs,
  games,
  players,
  players_to_tournaments,
  tournaments,
} from '@/lib/db/schema/tournaments';
import {
  GameModel,
  TournamentModel,
  TournamentStatus,
} from '@/types/tournaments';
import { eq } from 'drizzle-orm';

export const getTournamentState = async (
  id: string,
): Promise<TournamentModel> => {
  const tournamentDb = (
    await db
      .select()
      .from(tournaments)
      .where(eq(tournaments.id, id))
      .leftJoin(clubs, eq(clubs.id, tournaments.club_id))
  ).at(0);

  if (!tournamentDb) throw new Error('tournament not found');

  let status: TournamentStatus;
  if (!tournamentDb.tournament.started_at) status = 'not started';
  else if (!tournamentDb.tournament.closed_at) status = 'ongoing';
  else status = 'finished';

  const tournament: TournamentModel = {
    id: tournamentDb.tournament.id,
    date: tournamentDb.tournament.date,
    title: tournamentDb.tournament.title,
    type: tournamentDb.tournament.type,
    format: tournamentDb.tournament.format,
    organizer: {
      id: tournamentDb.tournament.club_id,
      name:tournamentDb.club!.name,
    },
    status,
    roundsNumber: tournamentDb.tournament.rounds_number,
    games: [],
    players: [],
    ongoingRound: 1,
    possiblePlayers: []
  };

  const playersDb = await db
    .select()
    .from(players_to_tournaments)
    .where(eq(players_to_tournaments.tournament_id, id))
    .leftJoin(players, eq(players.id, players_to_tournaments.player_id));

  if (!playersDb) return tournament;

  tournament.players = playersDb.map((each) => ({
    id: each!.player!.id,
    nickname: each!.player!.nickname,
    rating: each!.player!.rating,
    wins: each.players_to_tournaments.wins,
    draws: each.players_to_tournaments.draws,
    losses: each.players_to_tournaments.losses,
    color_index: each.players_to_tournaments.color_index,
  }));

  const gamesDb = await db
    .select()
    .from(games)
    .where(eq(games.tournament_id, id));

  if (!games) return tournament;

  tournament.games = gamesDb.map((game: DatabaseGame): GameModel => {
    const white_nickname = tournament.players.find(
      (player) => player.id === game.white_id,
    )!.nickname;
    const black_nickname = tournament.players.find(
      (player) => player.id === game.black_id,
    )!.nickname;
    // eslint-disable-next-line no-unused-vars
    const { tournament_id, ...gamenew } = game;
    return { ...gamenew, white_nickname, black_nickname };
  });

  return tournament;
};
