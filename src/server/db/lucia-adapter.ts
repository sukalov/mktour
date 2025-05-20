import { db } from '@/lib/db';
import { sessions, users } from '@/lib/db/schema/users';
import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle';

export const adapter = new DrizzleSQLiteAdapter(db, sessions, users);
