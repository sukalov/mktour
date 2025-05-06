import { validateRequest } from '@/lib/auth/lucia';

export async function GET() {
  const { user, session } = await validateRequest();
  return new Response(JSON.stringify({ user, session }), {
    status: 200,
    headers: {
      'content-type': 'application/json',
    },
  });
}
