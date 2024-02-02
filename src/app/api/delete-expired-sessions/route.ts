import { lucia } from "@/lib/auth/lucia";

export default async function GET(req: Request, res: Response) {
    if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response ('Unauthorized', { status: 401  })
      }
    await lucia.deleteExpiredSessions();
}