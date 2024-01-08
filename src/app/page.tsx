'use client';

import { SessionProvider } from 'next-auth/react';
import HomePage from '../components/home-page';
import { count } from 'drizzle-orm';

export default function Home() {
  return (
    <SessionProvider>
      <main className="flex min-h-[100svh]">
        <HomePage />
      </main>
    </SessionProvider>
  );
}
