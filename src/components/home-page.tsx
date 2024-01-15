import { Button } from '@/components/ui/button';
import LichessLogo from '@/components/ui/lichess-logo';
// import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import { TypeAnimation } from 'react-type-animation';
import '@/styles/cursor.css';

export default function HomePage() {
  // const { data: session, status, update } = useSession();
  const loading = false // const loading = status === 'loading';
  const cursor = 'custom-cursor';

  if (!loading) {
    return (
      <>
        {/* {!session ? ( */}
        {true ? (
          <div className="mt-16 flex h-[calc(100svh-5rem)] w-full flex-col gap-7 p-3 md:mt-2 md:gap-2">
            <div className="m-auto flex w-full max-w-[min(28rem,99.9%)] flex-auto grow items-center text-balance text-[clamp(3rem,8svh,6rem);] font-extrabold leading-none md:max-w-[min(70rem,90%)] md:text-center md:text-[clamp(5rem,10vw,6rem);]">
              <TypeAnimation
                sequence={[
                  'chess events',
                  400,
                  'chess events has become simple for everyone',
                  400,
                  (el) => {
                    el?.classList.add('cursor-animation');
                  },
                ]}
                wrapper="span"
                cursor={false}
                className={cursor}
                repeat={0}
              />
            </div>
            <div className="max-w- flex flex-col items-center justify-center gap-4 md:mx-auto md:flex-row md:gap-2 md:px-12">
              <div className="m-auto h-auto w-full px-1">
                <Button
                  className="m-auto flex h-28 min-h-24 w-full max-w-[28rem] flex-none flex-col gap-2 px-1 font-bold"
                  variant="outline"
                  // onClick={() => signIn('lichess', { redirect: false })}
                >
                  <div className=" grid-flow-col"></div>
                  <span className=" grid-col-3">
                    <LichessLogo size="40" />
                  </span>
                  <span className="grid-col--9 text-[1.4rem] font-light leading-none">
                    sign in with lichess
                  </span>
                </Button>
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
  return <></>;
}
