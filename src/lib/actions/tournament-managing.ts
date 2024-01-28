'use server';

import { db } from '@/lib/db';
import { players, playersToTournaments } from '@/lib/db/schema/tournaments';
import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { RedirectType, redirect } from 'next/navigation';
import { redis } from '@/lib/db/redis';
import { nanoid } from 'nanoid';
import { validateRequest } from '@/lib/auth/lucia';
import { NewTournamentForm } from '@/lib/zod/new-tournament-form';
import { DatabaseTournament, tournaments } from '@/lib/db/schema/tournaments';

export const createTournament = async (values: NewTournamentForm) => {
  const { user } = await validateRequest();
  const newTournamentID = nanoid();
  const newTournament: DatabaseTournament = {
    ...values,
    date: new Date(values.date).toISOString().slice(0, 10),
    id: newTournamentID,
    timestamp: new Date().getTime(),
    user_id: user?.id ?? null,
  };
  try {
    await db.insert(tournaments).values(newTournament);
    await redis.set(newTournamentID, JSON.stringify(newTournament));
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
  });
  const parse = schema.safeParse({
    tournamentId: formData.get('tournamentId'),
    name: formData.get('name'),
  });

  if (!parse.success) {
    return { message: 'failed to add player' };
  }

  const data = parse.data;

  try {
    const id = nanoid();
    console.log(id, data.name, data.tournamentId);
    await db.insert(players).values({ id, name: data.name });
    await db
      .insert(playersToTournaments)
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
      .delete(playersToTournaments)
      .where(
        and(
          eq(playersToTournaments.player_id, data.playerId),
          eq(playersToTournaments.tournament_id, data.tournamentId),
        ),
      );

    await db.delete(players).where(eq(players.id, data.playerId));
    revalidatePath('/');
    return { message: `deleted player ${data.name}` };
  } catch (e) {
    return { message: 'failed to delete player' };
  }
}
