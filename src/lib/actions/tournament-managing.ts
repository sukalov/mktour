'use server';

import { validateRequest } from '@/lib/auth/lucia';
import { db } from '@/lib/db';
import { redis } from '@/lib/db/redis';
import {
  DatabaseTournament,
  clubs_to_users,
  players,
  players_to_tournaments,
  tournaments,
} from '@/lib/db/schema/tournaments';
import { NewTournamentForm } from '@/lib/zod/new-tournament-form';
import { and, eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

export const createTournament = async (values: NewTournamentForm) => {
  const { user } = await validateRequest();
  const newTournamentID = nanoid();
  const club_id =
    (
      await db
        .select()
        .from(clubs_to_users)
        .where(and(eq(clubs_to_users.user_id, user!.id)))
    ).at(0)?.club_id ?? null;

  const newTournament: DatabaseTournament = {
    ...values,
    date: new Date(values.date).toISOString().slice(0, 10),
    id: newTournamentID,
    timestamp: new Date().getTime(),
    is_closed: false,
    is_started: false,
    club_id: String(club_id),
  };
  try {
    await db.insert(tournaments).values(newTournament);
    await redis.set(`tournament ${newTournamentID}`, newTournament);
    const url = '';
  } catch (e) {
    throw new Error('tournament has NOT been saved to redis');
  }
  redirect(`/tournament/${newTournamentID}`);
};

export async function addPlayer(
  prevState: {
    message: string;
  },
  formData: FormData,
) {
  const schema = z.object({
    tournamentId: z.string().min(1),
    name: z.string().min(1),
    club_id: z.string().min(1),
  });
  const parse = schema.safeParse({
    tournamentId: formData.get('tournamentId'),
    name: formData.get('name'),
    club_id: formData.get('club_id'),
  });

  if (!parse.success) {
    return { message: 'failed to add player' };
  }

  const data = parse.data;

  try {
    const id = nanoid();
    console.log(id, data.name, data.tournamentId);
    await db
      .insert(players)
      .values({ id, nickname: data.name, club_id: data.club_id });
    await db
      .insert(players_to_tournaments)
      .values({ player_id: id, tournament_id: data.tournamentId });

    revalidatePath('/');
    return { message: `added player ${data.name}` };
  } catch (e) {
    return { message: 'failed to add player' };
  }
}

export async function deletePlayer(
  prevState: {
    message: string;
  },
  formData: FormData,
) {
  const schema = z.object({
    playerId: z.string().min(1),
    tournamentId: z.string().min(1),
    name: z.string().min(1),
  });
  const data = schema.parse({
    playerId: formData.get('playerId'),
    tournamentId: formData.get('tournamentId'),
    name: formData.get('name'),
  });

  try {
    await db
      .delete(players_to_tournaments)
      .where(
        and(
          eq(players_to_tournaments.player_id, data.playerId),
          eq(players_to_tournaments.tournament_id, data.tournamentId),
        ),
      );

    await db.delete(players).where(eq(players.id, data.playerId));
    revalidatePath('/');
    return { message: `deleted player ${data.name}` };
  } catch (e) {
    return { message: 'failed to delete player' };
  }
}
