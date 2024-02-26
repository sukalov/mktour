import Dashboard from '@/app/tournament/[id]/new-dashboard';
import { getUser } from '@/lib/auth/utils';
import useStatusQuery from '@/lib/db/hooks/useStatusQuery';
import useTournamentToClubQuery from '@/lib/db/hooks/useTournamentToClubQuery';
import { redirect } from 'next/navigation';

export const revalidate = 0;

export default async function TournamentPage({ params }: TournamentPageProps) {
  const user = await getUser();
  if (!user) redirect(`/tournament/${params.id}/view`);
  const { tournament, club } = await useTournamentToClubQuery({ params });
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
    <div className="flex w-full flex-col items-start justify-between gap-4">
      {/* <pre>{JSON.stringify({ user, tournament, club, status }, null, 2)}</pre> */}
      {/* <pre>{JSON.stringify({ req }, null, 2)}</pre> */}
      {/* <TournamentDashboard tournamentId={tournament.id} /> */}
      <Dashboard />
    </div>
  );
}

interface TournamentPageProps {
  params: { id: string };
}
