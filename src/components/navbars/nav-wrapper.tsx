import Navigation from '@/components/navbars';
import { validateRequest } from '@/lib/auth/lucia';

export default async function NavWrapper() {
  const { user } = await validateRequest();
  return <Navigation user={user} />;
}
