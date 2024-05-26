import { db } from '@/lib/db';
import { users } from '@/lib/db/schema/auth';
import { eq } from 'drizzle-orm';

export default async function UserPage({ params }: TournamentPageProps) {
  const pageProfile = await db
    .select()
    .from(users)
    .where(eq(users.username, params.username))
    .get();

  return (
    <div className="w-full">
      <pre>{JSON.stringify(pageProfile, null, 2)}</pre>
    </div>
  );
}

export interface TournamentPageProps {
  params: { username: string };
}
