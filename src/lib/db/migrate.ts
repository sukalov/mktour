import { migrate } from 'drizzle-orm/planetscale-serverless/migrator';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/planetscale-serverless';

const runMigrate = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined');
  }

  const client = createClient({
    url: 'DATABASE_URL',
    authToken: 'DATABASE_AUTH_TOKEN',
  });
  const db = drizzle(client);

  console.log('⏳ Running migrations...');

  const start = Date.now();

  await migrate(db, { migrationsFolder: 'src/lib/db/migrations' });

  const end = Date.now();

  console.log(`✅ Migrations completed in ${end - start}ms`);

  process.exit(0);
};

runMigrate().catch((err) => {
  console.error('❌ Migration failed');
  console.error(err);
  process.exit(1);
});
