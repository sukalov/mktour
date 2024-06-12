import { DATABASE_AUTH_TOKEN, DATABASE_URL } from '@/lib/config/urls';
import * as schema1 from '@/lib/db/schema/auth';
import * as schema2 from '@/lib/db/schema/tournaments';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';

console.log(process.env.DATABASE_URL, process.env.DATABASE_AUTH_TOKEN)

const config = {
  url: DATABASE_URL,
  authToken: DATABASE_AUTH_TOKEN,
};

export const sqlite = createClient(config);

export const db = drizzle(sqlite, { schema: { ...schema1, ...schema2 } });
