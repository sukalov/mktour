import Authorized from '@/app/(routes)/authorized';
import Unauthorized from '@/app/(routes)/unauthorized';
import { validateRequest } from '@/lib/auth/lucia';
import '@/styles/cursor.css';

export default async function HomePage() {
  const { user } = await validateRequest();

  if (!user) return <Unauthorized />;
  return <Authorized />;
}
