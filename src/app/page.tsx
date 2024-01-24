import { Button } from '@/components/ui/button';
import Link from 'next/link';
import '@/styles/cursor.css';
import HomeText from '@/components/home-text';
import SignInWithLichessButton from '@/components/auth/sign-in-with-lichess-button';
import { validateRequest } from '@/lib/auth/lucia';
import TeamJoinToaster from '@/components/team-join-toaster';
import { redis } from '@/lib/db/redis';
import { cookies } from 'next/headers';

export default async function HomePage() {
  const { user } = await validateRequest();
  const token = cookies().get('token')?.value;
  let isNew: boolean | null = null

  if (user) {
    isNew = await redis.get(user.id)
    if (isNew) await redis.del(user.id)
  }

  return (
    <div>
      {!user ? (
        <div className="flex h-[calc(100svh-3.5rem)] w-full flex-col gap-7 p-3 md:gap-2 md:pb-8">
          <HomeText />
          <div className=" flex flex-col items-center justify-center gap-4 md:mx-auto md:flex-row md:gap-2 md:px-12">
            <div className="m-auto h-auto w-full px-1">
              <SignInWithLichessButton />
            </div>
            <Link href="/new-tournament" className="m-auto w-full px-1">
              <Button
                className="m-auto flex h-28 min-h-28 w-full max-w-[28rem] flex-col gap-2 font-bold"
                variant="default"
              >
                <h1 className=" text-2xl font-light min-[320px]:text-3xl">
                  make tournament
                </h1>
                <p className="text-balance font-extralight"></p>
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex min-h-[calc(100svh-3.5rem)] w-full flex-auto items-center justify-center p-3">
          <Link href="/new-tournament" className="m-auto px-1">
            <Button
              className="m-auto flex min-h-24 w-full max-w-[32rem] flex-col gap-2 font-bold"
              variant="default"
            >
              <h1 className="text-2xl font-light min-[400px]:text-3xl sm:px-8">
                make tournament
              </h1>
              <p className="text-balance font-extralight"></p>
            </Button>
            {isNew && token && <TeamJoinToaster token={token}/> }
          </Link>
        </div>
      )}
    </div>
  );
}
