'use server';
import { NewTournamentForm } from '@/app/new-tournament/new-tournament-form';
import { getServerSession } from 'next-auth';
import { RedirectType, redirect } from 'next/navigation';
import { options } from '@/app/api/auth/[...nextauth]/options';
import { redis } from '@/lib/db/redis';
import { randomUUID } from 'crypto';

export const createTournament = async (values: NewTournamentForm) => {
  const user = (await getServerSession(options))?.user.username;
  const newTournament = {
    ...values,
    timestamp: new Date().toISOString(),
    user,
  };
  const newTournamentID = randomUUID();
  console.log(newTournamentID);
  console.log(newTournament);
  await redis.set(newTournamentID, JSON.stringify(newTournament));
  redirect(`/tournament/${newTournamentID}`);
};
