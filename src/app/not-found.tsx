import { turboPascal } from '@/app/fonts';
import ClientTypeAnimation from '@/app/not-found-client';
import '@/styles/cursor.css';
import Link from 'next/link';
import { Suspense } from 'react';

export default function NotFound() {
  return (
    <div
      className={`${turboPascal.className} flex h-[calc(100svh-3.5rem)] flex-auto items-center justify-center align-middle`}
    >
      <main className="w-64">
        <h1 className="text-3xl font-semibold">error 404</h1>
        <Suspense fallback={<p>loading...</p>}>
          <ClientTypeAnimation />
        </Suspense>
        <Link href="/" className="hover:text-foreground/70 text-3xl underline">
          return home
        </Link>
      </main>
    </div>
  );
}
