import Profile from '@/app/user/[username]/profile';
import Empty from '@/components/empty';
import { publicCaller } from '@/server/api';
import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';

export default async function UserPage(props: TournamentPageProps) {
  const params = await props.params;
  const user = await publicCaller.user.auth();
  if (!user) redirect('/sign-in');
  const data = await publicCaller.user.infoByUsername({
    username: params.username,
  });

  const isOwner = user.username === params.username;
  const t = await getTranslations();

  if (!data) return <Empty>{t('Empty.user')}</Empty>;

  return <Profile user={data} isOwner={isOwner} />;
}
export interface TournamentPageProps {
  params: Promise<{ username: string }>;
}
