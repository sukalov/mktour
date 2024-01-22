'use server';
import { NewTournamentForm } from '@/app/new-tournament/new-tournament-form';
import { RedirectType, redirect } from 'next/navigation';
import { redis } from '@/lib/db/redis';
import { nanoid } from 'nanoid';
import { validateRequest } from '@/lib/auth/lucia';

export interface RedisTournamentInfo extends NewTournamentForm {
  user?: string;
}

export const createTournament = async (values: NewTournamentForm) => {
  const { user } = await validateRequest();
  const newTournament: RedisTournamentInfo = {
    ...values,
    timestamp: new Date().toISOString(),
    user: user?.username,
  };
  console.log(newTournament);
  const newTournamentID = nanoid();
  try {
    await redis.set(newTournamentID, JSON.stringify(newTournament));
  } catch (e) {}
  redirect(`/tournament/${newTournamentID}`);
};
