'use server';

import { validateRequest } from '@/lib/auth/lucia';
import { db } from '@/lib/db';
import {
  DatabasePlayer,
  DatabaseTournament,
  clubs,
  games,
  players,
  players_to_tournaments,
  tournaments,
} from '@/lib/db/schema/tournaments';
import { newid } from '@/lib/utils';
import { NewTournamentFormType } from '@/lib/zod/new-tournament-form';
import { eq, sql } from 'drizzle-orm';
import { redirect } from 'next/navigation';

export const createTournament = async (values: NewTournamentFormType) => {
  const { user } = await validateRequest();
  if (!user) throw new Error('unauthorized request');
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
  redirect(`/tournament/${newTournamentID}`);
};

export async function getTournamentGames(id: string) {
  return await db.select().from(games).where(eq(games.tournament_id, id));
}

export async function getTournamentPlayers(id: string) {
  const playersDb = await db
    .select()
    .from(players_to_tournaments)
    .where(eq(players_to_tournaments.tournament_id, id))
    .leftJoin(players, eq(players.id, players_to_tournaments.player_id));

  return playersDb.map((each) => ({
    id: each!.player!.id,
    nickname: each!.player!.nickname,
    rating: each!.player!.rating,
    wins: each.players_to_tournaments.wins,
    draws: each.players_to_tournaments.draws,
    losses: each.players_to_tournaments.losses,
    color_index: each.players_to_tournaments.color_index,
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

export async function getTournamentPossiblePlayers(id: string): Promise<Array<DatabasePlayer>> {
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
