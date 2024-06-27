'use server'

import MakeTournamentButton from '@/components/button-make-tournament';
import TeamJoinToaster from '@/components/team-join-toaster';
import { checkUser } from '@/lib/actions/check-if-user-is-new';
import '@/styles/cursor.css';

export default async function Authorized() {
  const isNew = checkUser();

  return (
    <div className="flex min-h-[calc(100svh-3.5rem)] w-full flex-auto items-center justify-center p-4">
      <MakeTournamentButton />
      {isNew && <TeamJoinToaster />}
    </div>
  );
}
