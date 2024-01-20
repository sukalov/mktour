import { Button } from '@/components/ui/button';
import LichessLogo from '@/components/ui/lichess-logo';
import Link from 'next/link';
import { TypeAnimation } from 'react-type-animation';
import '@/styles/cursor.css';
import { getUserAuth } from '@/lib/auth/utils';
import HomeText from '@/components/home-text';

export default async function HomePage() {
  const { session } = await getUserAuth();

  return (
    <>
      {!session ? (
        <div className="mt-16 flex h-[calc(100svh-5rem)] w-full flex-col gap-7 p-3 md:mt-2 md:gap-2">
          <HomeText />
          <div className="max-w- flex flex-col items-center justify-center gap-4 md:mx-auto md:flex-row md:gap-2 md:px-12">
            <div className="m-auto h-auto w-full px-1">
              <Link href={'/login/lichess'}>
                <Button
                  className="m-auto flex h-28 min-h-24 w-full max-w-[28rem] flex-none flex-col gap-2 px-1 font-bold"
                  variant="outline"
                >
                  <div className=" grid-flow-col"></div>
                  <span className=" grid-col-3">
                    <LichessLogo size="40" />
                  </span>
                  <span className="grid-col--9 text-[1.4rem] font-light leading-none">
                    sign in with lichess
                  </span>
                </Button>
              </Link>
            </div>
            <Link href="/new-tournament" className="m-auto w-full px-1">
              <Button
                className="m-auto flex min-h-28 w-full max-w-[28rem] flex-col gap-2 font-bold"
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
        <Link href="/new-tournament" className="m-auto w-full px-1">
          <Button
            className="m-auto flex min-h-24 w-full max-w-[28rem] flex-col gap-2 font-bold"
            variant="default"
          >
            <h1 className=" text-2xl font-light min-[320px]:text-3xl">
              make tournament
            </h1>
            <p className="text-balance font-extralight"></p>
          </Button>
        </Link>
      )}
    </>
  );
}
