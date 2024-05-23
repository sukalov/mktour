import * as schema1 from '@/lib/db/schema/auth';
import * as schema2 from '@/lib/db/schema/tournaments';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';

const config = {
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN,
};

export const sqlite = createClient(config);

export const db = drizzle(sqlite, { schema: { ...schema1, ...schema2 } });
