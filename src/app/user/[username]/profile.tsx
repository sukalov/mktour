'use client';

import FormattedMessage from '@/components/formatted-message';
import { useUserClubs } from '@/components/hooks/query-hooks/use-user-clubs';
import SkeletonList from '@/components/skeleton-list';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DatabaseUser } from '@/server/db/schema/users';
import { useFormatter, useTranslations } from 'next-intl';
import Link from 'next/link';
import { FC } from 'react';

const Profile: FC<{
  user: Pick<DatabaseUser, 'id' | 'username' | 'name' | 'rating' | 'createdAt'>;
  isOwner: boolean;
}> = ({ user, isOwner }) => {
  const { data, isPending } = useUserClubs(user.id);
  const format = useFormatter();
  const preparedCreatedAt = user.createdAt
    ? format.dateTime(user.createdAt, { dateStyle: 'long' })
    : null;
  const t = useTranslations('Profile');

  return (
    <div className="flex w-full flex-col gap-2 p-2">
      <div className="px-2 text-sm">
        {user.username} ({user.name})
      </div>
      <Card className="text-muted-foreground p-mk flex flex-col gap-2 text-sm break-words">
        <span>
          {t('rating')}: {user.rating}
        </span>
        {isOwner && (
          <>
            <span>
              {t('created')} {preparedCreatedAt}
            </span>
          </>
        )}
      </Card>
      {isOwner && (
        <Button variant="outline" className="w-full" asChild>
          <Link href="/user/edit">
            <FormattedMessage id="Common.edit" />
          </Link>
        </Button>
      )}
      <ClubList clubs={data} isPending={isPending} />
    </div>
  );
};

const ClubList: FC<ClubListProps> = ({ clubs, isPending }) => {
  const t = useTranslations('Profile');
  if (!clubs && isPending) return <SkeletonList />;
  if (!clubs) return null;

  return (
    <>
      <div className="px-2 text-sm">
        <span>{t('clubs')}</span>
      </div>
      <ul className="flex flex-col gap-2">
        {clubs.map((club) => (
          <li key={club.id}>
            <Link href={`/clubs/${club.id}`}>
              <Card className="p-mk min-h-8 text-sm">{club.name}</Card>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};

type ClubListProps = {
  clubs:
    | {
        id: string;
        name: string;
      }[]
    | undefined;
  isPending: boolean;
};

export default Profile;
