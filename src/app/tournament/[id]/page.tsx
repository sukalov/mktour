import TournamentDashboard from '@/components/tournament/tournament-dashboard';
import TournamentInfo from '@/components/tournament/tournament-info';
import { redis } from '@/lib/db/redis';
import { NewTournamentForm } from '@/lib/zod/new-tournament-form';
import { notFound } from 'next/navigation';

export default async function Tournament({
  params,
}: {
  params: { id: string };
}) {
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
      {data && <TournamentDashboard data={data} />}
    </div>
  );
}
