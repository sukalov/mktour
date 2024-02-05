import MakeTournamentButton from '@/components/button-make-tournament';
import TeamJoinToaster from '@/components/team-join-toaster';
import { redis } from '@/lib/db/redis';
import '@/styles/cursor.css';
import { User } from 'lucia';
import { cookies } from 'next/headers';

let isNew: boolean | null = null;

export default function Authorized({ user }: PageProps) {
  const token = cookies().get('token')?.value;
  checkUser(user);

  return (
    <div className="flex min-h-[calc(100svh-3.5rem)] w-full flex-auto items-center justify-center p-3">
      <MakeTournamentButton />
      {isNew && token && <TeamJoinToaster token={token} />}
    </div>
  );
}

const checkUser = async (user: User) => {
  isNew = await redis.get(user.id);
  if (isNew) await redis.del(user.id);

  return isNew;
};

type PageProps = {
  user: User;
};
