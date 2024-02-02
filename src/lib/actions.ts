'use server';

import { validateRequest } from '@/lib/auth/lucia';
import { getUser } from '@/lib/auth/utils';
import { db } from '@/lib/db';
import { redis } from '@/lib/db/redis';
import { DatabaseTournament, tournaments } from '@/lib/db/schema/tournaments';
import { NewTournamentForm } from '@/lib/zod/new-tournament-form';
import { nanoid } from 'nanoid';
import { redirect } from 'next/navigation';

export const createTournament = async (values: NewTournamentForm) => {
  const user = await getUser();
  const newTournamentID = nanoid();
  const newTournament: DatabaseTournament = {
    ...values,
    date: new Date(values.date).toISOString().slice(0, 10),
    id: newTournamentID,
    timestamp: new Date().getTime(),
    is_closed: false,
    is_started: false,
    club_id: values.club_id
  };
  try {
    await db.insert(tournaments).values(newTournament);
    await redis.set(newTournamentID, JSON.stringify(newTournament));
  } catch (e) {
    throw new Error('tournament has NOT been saved to redis');
  }
  redirect(`/tournament/${newTournamentID}`);
};
