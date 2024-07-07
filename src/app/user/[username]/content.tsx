'use client';

import { useUserClubs } from '@/components/hooks/query-hooks/use-user-clubs';
import SkeletonList from '@/components/skeleton-list';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DatabaseUser } from '@/lib/db/schema/auth';
import Link from 'next/link';
import { FC } from 'react';

const Content: FC<{ user: DatabaseUser; isOwner: boolean }> = ({
  user,
  isOwner,
}) => {
  const { data, isPending } = useUserClubs(user?.id);
  return (
    // FIXME Intl
    <div className="flex w-full flex-col gap-2 p-2">
      <div className="px-2">
        {user.username} ({user.name})
      </div>
      <Card className="flex flex-col gap-2 break-words p-4 text-muted-foreground">
        <span>lichess blitz rating: {user.rating}</span>
        {isOwner && (
          <>
            <span>email: {user.email}</span>
            <span>created on: {user.created_at?.toLocaleDateString('ru')}</span>
          </>
        )}
      </Card>
      {isOwner && (
        <Button onClick={console.log} variant="outline" className="w-full">
          Edit
        </Button>
      )}
      <ClubList clubs={data} isPending={isPending} />
    </div>
  );
};

const ClubList: FC<any> = ({ clubs, isPending }) => {
  if (!clubs && isPending) return <SkeletonList />;
  if (!clubs) return null;
  return (
    <>
      <div className="px-2">
        <span>clubs:</span>
      </div>
      <ul className="flex flex-col gap-2">
        {clubs.map((club: any) => (
          <li key={club.id}>
            <Link href={`/club/${club.id}`}>
              <Card className="min-h-8 p-4">{club.name}</Card>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Content;
