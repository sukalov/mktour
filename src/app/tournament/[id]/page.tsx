import Dashboard from '@/app/tournament/[id]/dashboard';
import { getUser } from '@/lib/auth/utils';
import useStatusQuery from '@/lib/db/hooks/useStatusQuery';
import useTournamentToClubQuery from '@/lib/db/hooks/useTournamentToClubQuery';
import { redirect } from 'next/navigation';

export const revalidate = 0;

export default async function TournamentPage({ params }: TournamentPageProps) {
  const user = await getUser();
  if (!user) redirect(`/tournament/${params.id}/view`);
  const { tournament, club } = await useTournamentToClubQuery({ params });
  console.log(tournament);
  const status = await useStatusQuery({ user, club });

  if (status === undefined) redirect(`/tournament/${params.id}/view`);

  // const req = await fetch('http://localhost:8080/', {
  //   next: { revalidate: 0 },
  //   headers: {
  //     Authorization: `Bearer ${cookies().get('token')?.value}`,
  //   },
  // });
  // const res = await req.json();
  // console.log(req);
  // const room = res.status === 404 ? null : res;

  return (
    <div className="w-full">
      <Dashboard tournament={tournament} />
    </div>
  );
}

interface TournamentPageProps {
  params: { id: string };
}
