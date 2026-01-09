import { getDatabaseAuthToken, getDatabaseUrl } from '@/lib/config/urls';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';

export async function POST(req: Request) {
  if (
    req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new Response('unauthorized', { status: 401 });
  }

  const url = getDatabaseUrl();
  const authToken = getDatabaseAuthToken();

  if (!url) {
    return Response.json(
      { error: 'DATABASE_URL is not defined' },
      { status: 500 },
    );
  }

  try {
    const client = createClient({ url, authToken });
    const db = drizzle(client);

    console.log('running migrations...');
    const start = Date.now();
    await migrate(db, { migrationsFolder: 'src/server/db/migrations' });
    const duration = Date.now() - start;
    console.log('migrations completed in', duration, 'ms');

    return Response.json({ success: true, duration });
  } catch (error) {
    console.error('migration failed:', error);
    return Response.json(
      { error: error instanceof Error ? error.message : 'migration failed' },
      { status: 500 },
    );
  }
}
