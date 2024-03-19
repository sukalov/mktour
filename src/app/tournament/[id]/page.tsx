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

  // TODO fix tournament title display
  return (
    <div className="w-full">
      {/* <div className="fixed top-5 z-50 flex w-full justify-center">
        <div className="max-w-[50%] truncate text-xs">
          {tournament.title}
        </div>
      </div> */}
      <Dashboard tournament={tournament} />
    </div>
  );
}

interface TournamentPageProps {
  params: { id: string };
}
