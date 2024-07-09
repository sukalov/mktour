import Profile from '@/app/user/[username]/profile';
import getUserData from '@/lib/actions/get-user-data';
import { validateRequest } from '@/lib/auth/lucia';
import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';

export default async function UserPage({ params }: TournamentPageProps) {
  const { user } = await validateRequest();
  const data = await getUserData(params.username);

  if (!user) redirect('/sign-in');
  const isOwner = user.username === params.username;
  const t = await getTranslations();

  if (!data)
    return (
      <div className="mt-8 w-full text-center text-muted-foreground">
        {t('Empty.user')}
      </div>
    );

  return <Profile user={data} isOwner={isOwner} />;
}
export interface TournamentPageProps {
  params: { username: string };
}
