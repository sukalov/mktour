
import NavMenu from '@/components/navbars/nav-menu/nav-menu';
import { validateRequest } from '@/lib/auth/lucia';

export default async function NavMenuWrapper() {
  const { user } = await validateRequest();
  return <NavMenu user={user} node_env={process.env.NODE_ENV} />;
}
