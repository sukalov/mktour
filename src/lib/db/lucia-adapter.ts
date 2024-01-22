import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle';
import { db } from '@/lib/db';
import { sessions, users } from '@/lib/db/schema/auth';

export const adapter = new DrizzleSQLiteAdapter(db, sessions, users);
