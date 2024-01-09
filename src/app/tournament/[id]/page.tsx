import { redis } from "@/lib/db/redis"

export default async function Tournament ({ params }: {params: {id: string}}) {
    const data = await redis.get(params.id)
    return (
        <div className="flex flex-auto flex-col gap-6 items-center justify-center w-full h-svh">
            <p>{JSON.stringify(params)}</p>
            <div>{JSON.stringify(data, null, 2)}</div>
        </div>
    )
}