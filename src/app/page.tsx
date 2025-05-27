import Authorized from '@/app/(routes)/authorized';
import Unauthorized from '@/app/(routes)/unauthorized';
import { publicCaller } from '@/server/api';

import '@/styles/cursor.css';
import { Suspense } from 'react';

async function HomeContent() {
  const user = await publicCaller.user.auth();

  if (!user) {
    return <Unauthorized />;
  }

  return <Authorized />;
}

export default function HomePage() {
  return (
    <Suspense fallback={<p>loading...</p>}>
      <HomeContent />
    </Suspense>
  );
}
