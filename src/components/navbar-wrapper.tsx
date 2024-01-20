
import Navbar from './navbar';
import { AuthSession, getUserAuth } from '@/lib/auth/utils';

export default async function NavbarWrapper() {
  const authSession = await getUserAuth() as AuthSession;
  return (
      <Navbar authSession={authSession}/>
  );
}
