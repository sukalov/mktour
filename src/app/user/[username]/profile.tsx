'use client';

import FormattedMessage from '@/components/formatted-message';
import { useUserSelectClub } from '@/components/hooks/mutation-hooks/use-user-select-club';
import { useUserClubs } from '@/components/hooks/query-hooks/use-user-clubs';
import SkeletonList from '@/components/skeleton-list';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DatabaseUser } from '@/server/db/schema/users';
import { useQueryClient } from '@tanstack/react-query';
import { useFormatter, useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FC } from 'react';

const Profile: FC<{ user: DatabaseUser; isOwner: boolean }> = ({
  user,
  isOwner,
}) => {
  const { data, isPending } = useUserClubs(user?.id);
  const queryClient = useQueryClient();
  const clubSelection = useUserSelectClub(queryClient);
  const format = useFormatter();
  const preparedCreatedAt = user.created_at
    ? format.dateTime(user.created_at, { dateStyle: 'long' })
    : null;
  const t = useTranslations('Profile');
  const router = useRouter();
  const mutate = (clubId: string) =>
    clubSelection.mutate({
      clubId,
      userId: user.id,
    });

  return (
    <div className="flex w-full flex-col gap-2 p-2">
      <div className="px-2">
        {user.username} ({user.name})
      </div>
      <Card className="text-muted-foreground flex flex-col gap-2 p-4 break-words">
        <span>
          {t('rating')}: {user.rating}
        </span>
        {isOwner && (
          <>
            <span>
              {t('email')}: {user.email}
            </span>
            <span>
              {t('created')} {preparedCreatedAt}
            </span>
          </>
        )}
      </Card>
      {isOwner && (
        <Button
          onClick={() => router.push('/user/edit')}
          variant="outline"
          className="w-full"
        >
          <FormattedMessage id="Common.edit" />
        </Button>
      )}
      <ClubList clubs={data} isPending={isPending} mutate={mutate} />
    </div>
  );
};

const ClubList: FC<ClubListProps> = ({ clubs, isPending, mutate }) => {
  const t = useTranslations('Profile');
  if (!clubs && isPending) return <SkeletonList />;
  if (!clubs) return null;

  return (
    <>
      <div className="px-2">
        <span>{t('clubs')}</span>
      </div>
      <ul className="flex flex-col gap-2">
        {clubs.map((club) => (
          <li key={club.id}>
            <Link
              href={`/clubs/my`}
              onClick={() => club.id && mutate(club.id)} // FIXME maybe find a better way
            >
              <Card className="min-h-8 p-4">{club.name}</Card>
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
        id: string | null;
        name: string | null;
      }[]
    | undefined;
  isPending: boolean;
  mutate: (_arg: string) => void;
};

export default Profile;
