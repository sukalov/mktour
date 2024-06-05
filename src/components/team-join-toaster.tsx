'use client';

import { turboPascal } from '@/app/fonts';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { toast } from 'sonner';

export default function TeamJoinToaster() {
  const handleCancel = () => {
    toast.success('too bad... we hope you join us one day!');
    setTimeout(() => toast.dismiss('teamJoin'));
  };

  const handleJoin = async () => {
    setTimeout(() => toast.dismiss('teamJoin'));
    toast.promise(
      fetch('/api/join-team', {
        method: 'POST',
      }),
      {
        loading: 'adding you right now!',
        error: 'some error happened, too bad...',
        success: "yeee, now you're in the team!",
      },
    );
  };

  toast(
    <div>
      <h1
        className={`${turboPascal.className} text-center text-2xl font-bold leading-8`}
      >
        WELCOME TO MKTOUR
      </h1>
      <p>
        in case you experience any difficulties while using our app, please
        describe the problem at&nbsp;
        <Link
          href="https://lichess.org/team/mktour"
          className="font-semibold underline"
        >
          our lichess team
        </Link>
        &nbsp; forum. do you want to join the team, where you can reach us any
        time?
      </p>
      <br />
      <div className="flex justify-center gap-2">
        <Button onClick={handleJoin}>join team</Button>
        <Button variant="secondary" onClick={handleCancel}>
          don&apos;t join
        </Button>
      </div>
    </div>,
    {
      id: 'teamJoin',
      dismissible: true,
      duration: 150000,
    },
  );
  return <></>;
}
