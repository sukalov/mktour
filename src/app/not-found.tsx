'use client';

import { turboPascal } from '@/app/fonts';
import { TypeAnimation } from 'react-type-animation';
import '@/styles/cursor.css';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      className={`${turboPascal.className} flex h-[calc(100svh-4rem)] flex-auto items-center justify-center align-middle`}
    >
      <main className=" w-64">
        <h1 className="text-3xl font-semibold">error 404</h1>
        <TypeAnimation
          sequence={[
            'page not found',
            400,
            (el) => {
              el?.classList.add('cursor-animation');
            },
          ]}
          wrapper="h2"
          cursor={false}
          className={'custom-cursor text-3xl'}
          repeat={0}
        />
        <Link href="/" className="text-3xl underline hover:text-foreground/70">
          return home
        </Link>
      </main>
    </div>
  );
}
