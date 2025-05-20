import { DATABASE_AUTH_TOKEN, DATABASE_URL } from '@/lib/config/urls';
import * as schema5 from '@/server/db/schema/clubs';
import * as schema3 from '@/server/db/schema/notifications';
import * as schema4 from '@/server/db/schema/players';
import * as schema1 from '@/server/db/schema/tournaments';
import * as schema2 from '@/server/db/schema/users';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';

const config = {
  url: DATABASE_URL,
  authToken: DATABASE_AUTH_TOKEN,
};

const sqlite = createClient(config);

export const db = drizzle(sqlite, {
  schema: { ...schema1, ...schema2, ...schema3, ...schema4, ...schema5 },
});
