'use server';

import MakeTournamentButton from '@/components/button-make-tournament';
import TeamJoinToaster from '@/components/team-join-toaster';
import '@/styles/cursor.css';
import { cookies } from 'next/headers';

export default async function Authorized() {
  const isNew = (await cookies()).get('show_new_user_toast');

  return (
    <div className="flex min-h-[calc(100svh-3.5rem)] w-full flex-auto items-center justify-center p-4">
      <MakeTournamentButton />
      {isNew && <TeamJoinToaster />}
    </div>
  );
}
