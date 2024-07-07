import GuestContent from '@/app/user/[username]/guest-content';
import OwnerContent from '@/app/user/[username]/owner-content';
import { validateRequest } from '@/lib/auth/lucia';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema/auth';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

export default async function UserPage({ params }: TournamentPageProps) {
  const { user } = await validateRequest();
  const data = await db
    .select()
    .from(users)
    .where(eq(users.username, params.username))
    .get();

  if (!user) redirect('/sign-in');
  if (!data) return null; // FIXME handle no-data
  if (user.username === params.username) return <OwnerContent props={data} />;

  return <GuestContent props={data} />;
}

export interface TournamentPageProps {
  params: { username: string };
}

export type ProfileProps = {
  id: string;
  name: string | null;
  email: string;
  username: string;
  rating: number | null;
  selected_club: string;
  created_at: Date | null;
};
