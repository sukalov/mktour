import { Redis } from '@upstash/redis';

export const redis = new Redis({
    url: String(process.env.REDIS_URL),
    token: String(process.env.REDIS_TOKEN)
})