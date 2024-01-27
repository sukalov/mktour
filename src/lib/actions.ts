'use server';

import { RedirectType, redirect } from 'next/navigation';
import { redis } from '@/lib/db/redis';
import { nanoid } from 'nanoid';
import { validateRequest } from '@/lib/auth/lucia';
import { NewTournamentForm } from '@/lib/zod/new-tournament-form';
import { DatabaseTournament, tournaments } from '@/lib/db/schema/tournaments';
import { db } from '@/lib/db';

export const createTournament = async (values: NewTournamentForm) => {
  const { user } = await validateRequest();
  const newTournamentID = nanoid();
  const newTournament: DatabaseTournament = {
    ...values,
    date: (new Date(values.date)).toISOString().slice(0, 10),
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
