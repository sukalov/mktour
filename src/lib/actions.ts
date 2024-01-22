'use server';
import { RedirectType, redirect } from 'next/navigation';
import { redis } from '@/lib/db/redis';
import { nanoid } from 'nanoid';
import { validateRequest } from '@/lib/auth/lucia';
import { NewTournamentForm } from '@/lib/zod/new-tournament-form';

export const createTournament = async (values: NewTournamentForm) => {
  const { user } = await validateRequest();
  const newTournament: NewTournamentForm = {
    ...values,
    timestamp: new Date().toISOString(),
    user: user?.username,
  };
  console.log(newTournament);
  const newTournamentID = nanoid();
  try {
    await redis.set(newTournamentID, JSON.stringify(newTournament));
  } catch (e) {
    throw new Error('tournament has NOT been saved to redis');
  }
  redirect(`/tournament/${newTournamentID}`);
};
