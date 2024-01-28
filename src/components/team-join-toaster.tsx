'use client';
import { turboPascal } from '@/app/fonts';
import { X } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function TeamJoinToaster(props: { token: string }) {
  const abortTeamJoin = async () => {
    try {
      const res = await fetch('/api/leave-team', {
        method: 'POST',
      });
      if (res.ok) {
        toast.dismiss('teamJoin');
        toast.success('sorry to see you going... we hope you join us one day!');
      }
      if (!res.ok) {
        toast.dismiss('teamJoin');
        toast.error(
          <p>
            some error happened, we are sorry for that! please, consider leaving
            the team manually visiting{' '}
            <Link
              href="https://lichess.org/team/mktour"
              className="font-semibold underline"
            >
              lichess.org/team/mktour
            </Link>
          </p>,
        );
      }
    } catch (err) {
      toast.dismiss('teamJoin');
      toast.error(
        <p>
          some error happened. we are sorry for that. please, consider leaving
          the team manually visiting{' '}
          <Link
            href="https://lichess.org/team/mktour"
            className="font-semibold underline"
          >
            lichess.org/team/mktour
          </Link>
        </p>,
      );
    }
  };

  toast(
    <div>
      <button
        onClick={() => toast.dismiss('teamJoin')}
        className="absolute right-2 top-2"
      >
        <span className="sr-only">dismiss</span>
        <X size={20} />
      </button>
      <h1
        className={`${turboPascal.className} text-center text-2xl font-bold leading-8`}
      >
        WELCOME TO MKTOUR
      </h1>
      <p>
        in case you experience any difficulties while using our app, please
        describe the problem at{' '}
        <Link
          href="https://lichess.org/team/mktour"
          className="font-semibold underline"
        >
          our lichess team
        </Link>{' '}
        forum. you are now being automatically added to the team, where you can
        reach us any time!
      </p>
      <br />
      <p>
        if you don&apos;t want to join any teams, that&apos;s fine,{' '}
        <button onClick={abortTeamJoin} className="font-bold underline">
          click here
        </button>
      </p>
    </div>,
    {
      id: 'teamJoin',
      dismissible: true,
      style: {
        width: `min(90vw, 600px)`,
        right: 0,
      },
      duration: 15000,
    },
  );
  return <></>;
}
