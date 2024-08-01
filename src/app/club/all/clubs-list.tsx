'use client';

import { Card, CardFooter } from '@/components/ui/card';
import { DatabaseClub } from '@/lib/db/schema/tournaments';
import { useFormatter } from 'next-intl';
import Link from 'next/link';
import { FC } from 'react';

const ClubsList: FC<{ clubs: DatabaseClub[] }> = ({ clubs }) =>
  clubs.map(ClubItem);

const ClubItem = (club: DatabaseClub) => {
  const format = useFormatter();

  return (
    <Card key={club.id} className="p-4">
      <Link href={club.id}>
        {club.name}
        <CardFooter>{club.description}</CardFooter>
        <div className="text-muted-foreground">
          {format.dateTime(club.created_at!, { dateStyle: 'medium' })}
        </div>
      </Link>
    </Card>
  );
};

export default ClubsList;
