import OrganizerPageContent from '@/app/organizer/page-content';
import { cookies } from 'next/headers';

export default function SocketTestsPage() {
  const session = cookies().get('auth_session')?.value ?? '';
  return (
    <div>
      <OrganizerPageContent session={session} />
    </div>
  );
}
