import { logout } from '@/lib/actions/logout';

export const POST = async () => {
  await logout();
  return new Response(null, {
    status: 302,
    headers: {
      Location: '/sign-in', // redirect to login page
    },
  });
};
