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

  if (!status) redirect(`/tournament/${params.id}/view`);

  return (
    <div className="w-full">
      <div className="fixed left-0 right-0 top-5 z-50 m-auto w-[300px] max-w-[50%] truncate opacity-30 text-xs">
        {tournament.title}
      </div>
      <Dashboard tournament={tournament} />
    </div>
  );
}

interface TournamentPageProps {
  params: { id: string };
}
