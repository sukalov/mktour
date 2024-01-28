import SignInWithLichessButton from '@/components/auth/sign-in-with-lichess-button';
import CreateTournamentButton from '@/components/button-create-tournament';
import HomeText from '@/components/home-text';
import TeamJoinToaster from '@/components/team-join-toaster';
import { validateRequest } from '@/lib/auth/lucia';
import { redis } from '@/lib/db/redis';
import '@/styles/cursor.css';
import { cookies } from 'next/headers';

export default async function HomePage() {
  console.log(
    'chess tournaments have become simple for everyone. \nexcept for devs. \nfor devs it’s still hard',
  );
  const { user } = await validateRequest();
  const token = cookies().get('token')?.value;
  let isNew: boolean | null = null;

  const Unauthorized = () => {
    return (
      <div className="flex h-[calc(100svh-3.5rem)] w-full flex-col gap-7 p-3 md:gap-2 md:pb-8">
        <HomeText />
        <div className=" flex flex-col items-center justify-center gap-4 md:mx-auto md:flex-row md:gap-2 md:px-12">
          <div className="m-auto h-auto w-full px-1">
            <SignInWithLichessButton />
          </div>
          <CreateTournamentButton />
        </div>
      </div>
    );
  };

  const Authorized = () => {
    return (
      <div className="flex min-h-[calc(100svh-3.5rem)] w-full flex-auto items-center justify-center p-3">
        <CreateTournamentButton />
        {isNew && token && <TeamJoinToaster token={token} />}
      </div>
    );
  };

  if (user) {
    isNew = await redis.get(user.id);
    if (isNew) await redis.del(user.id);
  }

  if (!user) return <Unauthorized />;
  return <Authorized />;
}
