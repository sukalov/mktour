'use server';

import { validateRequest } from '@/lib/auth/lucia';
import { db } from '@/lib/db';
import {
  DatabaseTournament,
  clubs_to_users,
  tournaments,
} from '@/lib/db/schema/tournaments';
import { newid } from '@/lib/utils';
import { NewTournamentFormType } from '@/lib/zod/new-tournament-form';
import { and, eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

export const createTournament = async (values: NewTournamentFormType) => {
  const { user } = await validateRequest();
  const newTournamentID = newid();
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
    created_at: new Date(),
    closed_at: null,
    started_at: null,
    club_id: String(club_id),
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
