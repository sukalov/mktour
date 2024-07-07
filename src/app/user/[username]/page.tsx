import Content from '@/app/user/[username]/content';
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
  const isOwner = user.username === params.username;

  if (!data)
    return (
      <div className="mt-8 w-full text-center text-muted-foreground">
        No data {/* FIXME Intl */}
      </div>
    );

  return <Content user={data} isOwner={isOwner} />;
}
export interface TournamentPageProps {
  params: { username: string };
}
