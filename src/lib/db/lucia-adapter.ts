import { db } from '@/lib/db';
import { sessions, users } from '@/lib/db/schema/auth';
import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle';

export const adapter = new DrizzleSQLiteAdapter(db, sessions, users);
