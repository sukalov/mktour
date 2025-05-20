import { db } from '@/server/db';
import { sessions, users } from '@/server/db/schema/users';
import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle';

export const adapter = new DrizzleSQLiteAdapter(db, sessions, users);
