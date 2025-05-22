import Authorized from '@/app/(routes)/authorized';
import Unauthorized from '@/app/(routes)/unauthorized';
import { publicCaller } from '@/server/api';

import '@/styles/cursor.css';

export default async function HomePage() {
  const user = await publicCaller.user.auth();

  if (!user) return <Unauthorized />;
  return <Authorized />;
}
