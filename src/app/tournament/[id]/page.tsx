import { NewTournamentForm } from '@/app/new-tournament/new-tournament-form';
import TournamentInfo from '@/components/tournament-info';
import { RedisTournamentInfo } from '@/lib/actions';
import { redis } from '@/lib/db/redis';

export default async function Tournament({
  params,
}: {
  params: { id: string };
}) {
  let data: RedisTournamentInfo;
  try {
    // data = await redis.get(params.id) as RedisTournamentInfo;
    data = {
      tournament: 'test tournament',
      date: new Date('2024-01-09T08:58:56.329Z'),
      format: 'single elimination',
      type: 'solo',
      timestamp: '2024-01-09T08:59:11.487Z',
      user: 'sukalov',
    };
  } catch (e) {
    console.log(e);
    data = {
      tournament: 'test tournament',
      date: new Date('2024-01-09T08:58:56.329Z'),
      format: 'single elimination',
      type: 'solo',
      timestamp: '2024-01-09T08:59:11.487Z',
      user: 'sukalov',
    };
  }
  return (
    <div className="p-2 pt-16">
      {/* @ts-expect-error Server Component */}
      <TournamentInfo data={data} />
      {/* <p>{JSON.stringify(params)}</p> */}
      {/* {data && <div>{JSON.stringify(data, null, 2)}</div>} */}
    </div>
  );
}
