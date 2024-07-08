import Content from '@/app/user/[username]/content';
import getUserData from '@/lib/actions/get-user-data';
import { validateRequest } from '@/lib/auth/lucia';
import { redirect } from 'next/navigation';

export default async function UserPage({ params }: TournamentPageProps) {
  const { user } = await validateRequest();
  const data = await getUserData(params.username);

  if (!user) redirect('/sign-in');
  const isOwner = user.username === params.username;

  if (!data)
    return (
      <div className="mt-8 w-full text-center text-muted-foreground">
        User not found {/* FIXME Intl */}
      </div>
    );

  return <Content user={data} isOwner={isOwner} />;
}
export interface TournamentPageProps {
  params: { username: string };
}
