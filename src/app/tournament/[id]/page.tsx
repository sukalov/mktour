import TournamentDashboard from '@/components/tournament/tournament-dashboard';
import TournamentInfo from '@/components/tournament/tournament-info';
import { redis } from '@/lib/db/redis';
import { Tournament } from '@/lib/tournaments/models';
import { NewTournamentForm } from '@/lib/zod/new-tournament-form';
import { notFound } from 'next/navigation';

export default async function TournamentPage({ params }: TournamentProps) {
  let data: NewTournamentForm | undefined;
  try {
    data = (await redis.get(params.id)) as NewTournamentForm;
  } catch (e) {
    console.log(e);
  }
  return (
    <div className="p-2">
      {/* @ts-expect-error Server Component */}
      {data ? <TournamentInfo data={data} /> : notFound()}
      {/* @ts-expect-error Server Component */}
      {data && <TournamentDashboard data={data} id={params.id} />}
    </div>
  );
}

interface TournamentProps {
  params: { id: string };
}
