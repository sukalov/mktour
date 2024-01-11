'use server';
import { NewTournamentForm } from '@/app/new-tournament/new-tournament-form';
import { getServerSession } from 'next-auth';
import { RedirectType, redirect } from 'next/navigation';
import { options } from '@/app/api/auth/[...nextauth]/options';
import { redis } from '@/lib/db/redis';
import { randomUUID } from 'crypto';

export interface RedisTournamentInfo extends NewTournamentForm {
  user: string | undefined
}

export const createTournament = async (values: NewTournamentForm) => {
  const user = (await getServerSession(options))?.user.username;
  const newTournament: RedisTournamentInfo = {
    ...values,
    timestamp: new Date().toISOString(),
    user,
  };
  console.log(newTournament)
  const newTournamentID = randomUUID();
  try {
    await redis.set(newTournamentID, JSON.stringify(newTournament));
  } catch (e) {
    console.log(e)
  }
  redirect(`/tournament/${newTournamentID}`);
};
