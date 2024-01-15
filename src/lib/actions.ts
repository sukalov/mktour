'use server';
import { NewTournamentForm } from '@/app/new-tournament/new-tournament-form';
// import { getServerSession } from 'next-auth';
import { RedirectType, redirect } from 'next/navigation';
import { redis } from '@/lib/db/redis';
import { nanoid } from 'nanoid';

export interface RedisTournamentInfo extends NewTournamentForm {
  user?: string;
}

export const createTournament = async (values: NewTournamentForm) => {
  // const user = (await getServerSession(options))?.user.username;
  const newTournament: RedisTournamentInfo = {
    ...values,
    timestamp: new Date().toISOString(),
    // user,
  };
  console.log(newTournament);
  const newTournamentID = nanoid();
  try {
    await redis.set(newTournamentID, JSON.stringify(newTournament));
  } catch (e) {
    
  }
  redirect(`/tournament/${newTournamentID}`);
};
