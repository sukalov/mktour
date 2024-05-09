import SocketTests from '@/app/socket-tests/page-content';
import { cookies } from 'next/headers';

export default function SocketTestsPage() {
  const session = cookies().get('auth_session')?.value ?? '';
  return (
    <div>
      <SocketTests session={session} />
    </div>
  );
}
