import { getUser } from '@/lib/auth/utils';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const revalidate = 0;

export default async function TournamentPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getUser();
  if (!user) redirect(`/tournament/${params.id}/view`);

  const req = await fetch('http://localhost:4000', {
    next: { revalidate: 0 },
    headers: {
      Authorization: `Bearer ${cookies().get('token')?.value}`,
    },
  });
  const res = await req.json();
  console.log(res);
  const room = res.status === 404 ? null : res;

  // fetch user session for server rendering

  return (
    <div className="flex w-full flex-col items-start justify-between gap-4">
      {JSON.stringify(res)}
    </div>
  );
}
