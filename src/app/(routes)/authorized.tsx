import MakeTournamentButton from '@/components/button-make-tournament';
import TeamJoinToaster from '@/components/team-join-toaster';
import { redis } from '@/lib/db/redis';
import '@/styles/cursor.css';
import { User } from 'lucia';

export default async function Authorized({ user }: PageProps) {
const isNew = await checkUser(user);

  return (
    <div className="flex min-h-[calc(100svh-3.5rem)] w-full flex-auto items-center justify-center p-4">
      <MakeTournamentButton />
      {isNew && <TeamJoinToaster />}
      {/* <TeamJoinToaster /> */}
    </div>
  );
}

const checkUser = async (user: User) => {
  let test: null | 10 = await redis.get(user.id);
  if (test) redis.del(user.id);
  return test;
};

type PageProps = {
  user: User;
};
