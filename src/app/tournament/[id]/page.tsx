import { redis } from '@/lib/db/redis';

export default async function Tournament({
  params,
}: {
  params: { id: string };
}) {
  const data = await redis.get(params.id);
  return (
    <div className="flex h-svh w-full flex-auto flex-col items-center justify-center gap-6">
      <p>{JSON.stringify(params)}</p>
      <div>{JSON.stringify(data, null, 2)}</div>
    </div>
  );
}
