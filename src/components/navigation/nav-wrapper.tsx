import Navigation from '@/components/navigation';
import { publicCaller } from '@/server/api';

export default async function NavWrapper() {
  const user = await publicCaller.user.auth();
  return <Navigation user={user} />;
}
