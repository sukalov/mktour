import { db } from '@/lib/db';
import { users } from '@/lib/db/schema/auth';
import { eq } from 'drizzle-orm';

const getUserData = async (username: string) => {
  return db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .get();
};

export default getUserData