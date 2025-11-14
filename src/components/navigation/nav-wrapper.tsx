import Navigation from '@/components/navigation';
import { publicCaller } from '@/server/api';

export default async function NavWrapper() {
  const user = await publicCaller.auth.info();
  return <Navigation user={user} />;
}
