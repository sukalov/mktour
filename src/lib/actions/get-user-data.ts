import { db } from '@/server/db';
import { users } from '@/server/db/schema/users';
import { eq } from 'drizzle-orm';

const getUserData = async (username: string) => {
  return db.select().from(users).where(eq(users.username, username)).get();
};

export default getUserData;
