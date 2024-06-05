import { cookies } from 'next/headers';

export async function POST() {
  const token = cookies().get('token')?.value;
  const response = await fetch('https://lichess.org/team/mktour/join', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.ok) return new Response(null, { status: 200 });
  return new Response(null, { status: 500 });
}
