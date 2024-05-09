import { validateRequest } from '@/lib/auth/lucia';
import Navbar from './navbar';

export default async function NavbarWrapper() {
  const { user } = await validateRequest();
  return <Navbar user={user} node_env={process.env.NODE_ENV} />;
}
