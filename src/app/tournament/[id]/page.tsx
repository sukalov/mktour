import Dashboard from '@/app/tournament/[id]/dashboard';
import { getUser } from '@/lib/auth/utils';
import useStatusQuery from '@/lib/db/hooks/use-status-query';
import useTournamentToClubQuery from '@/lib/db/hooks/use-tournament-to-club-query';
import { notFound, redirect } from 'next/navigation';

export const revalidate = 0;

export default async function TournamentPage({ params }: TournamentPageProps) {
  const user = await getUser();
  const { tournament, club } = await useTournamentToClubQuery({ params });
  if (!tournament) notFound();
  const status = await useStatusQuery({ user, club });
  if (!user || !status) redirect(`/tournament/${params.id}/view`);

  return (
    <div className="w-full">
      <Dashboard tournament={tournament} />
    </div>
  );
}

export interface TournamentPageProps {
  params: { id: string };
}
