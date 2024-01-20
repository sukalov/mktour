import { getPageSession } from '@/lib/auth/lucia';

export async function GET(request: Request) {
  const session = await getPageSession();
  return new Response(JSON.stringify(session), {
    status: 200,
    headers: {
      'content-type': 'application/json',
    },
  });
}
