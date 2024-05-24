'use server';

import { validateRequest } from '@/lib/auth/lucia';
import { db } from '@/lib/db';
import {
  DatabaseTournament,
  tournaments
} from '@/lib/db/schema/tournaments';
import { newid } from '@/lib/utils';
import { NewTournamentFormType } from '@/lib/zod/new-tournament-form';
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
