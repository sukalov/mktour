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
    data = await redis.get(params.id) as RedisTournamentInfo;
  } catch (e) {
    console.log(e);
  }
  return (
    <div className="p-2 pt-16">
      {/* @ts-expect-error Server Component */}
      {data && <TournamentInfo data={data} />}
      {/* <p>{JSON.stringify(params)}</p> */}
      {/* {data && <div>{JSON.stringify(data, null, 2)}</div>} */}
    </div>
  );
}
