import Profile from '@/app/user/[username]/profile';
import Empty from '@/components/empty';
import getUserData from '@/lib/actions/get-user-data';
import { validateRequest } from '@/lib/auth/lucia';
import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';

export default async function UserPage(props: TournamentPageProps) {
  const params = await props.params;
  const { user } = await validateRequest();
  if (!user) redirect('/sign-in');
  const data = await getUserData(params.username);

  const isOwner = user.username === params.username;
  const t = await getTranslations();

  if (!data) return <Empty>{t('Empty.user')}</Empty>;

  return <Profile user={data} isOwner={isOwner} />;
}
export interface TournamentPageProps {
  params: Promise<{ username: string }>;
}
