import { CACHE_TAGS } from '@/lib/cache-tags';
import { logout } from '@/server/mutations/logout';
import { revalidateTag } from 'next/cache';

export const POST = async () => {
  await logout();
  revalidateTag(CACHE_TAGS.AUTH, 'max');
  return new Response(null, {
    status: 302,
    headers: {
      Location: '/sign-in',
    },
  });
};
