import MakeTournamentButton from '@/components/button-make-tournament';
import TeamJoinToaster from '@/components/team-join-toaster';
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { cookies } from 'next/headers';

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

const checkUser = () => {
  let test: RequestCookie | undefined = cookies().get('show_new_player_toast');
  if (test) cookies().delete('show_new_player_toast');
  return test;
};
