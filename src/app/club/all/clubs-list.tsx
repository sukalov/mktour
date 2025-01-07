'use client';

import { ClubCard } from '@/app/club/[id]/club';
import { DatabaseClub } from '@/lib/db/schema/tournaments';
import Link from 'next/link';
import { FC } from 'react';

const ClubsList: FC<{ clubs: DatabaseClub[] }> = ({ clubs }) => {
  return clubs.map((club) => <ClubItemIteratee key={club.id} {...club} />);
};

const ClubItemIteratee = (club: DatabaseClub) => (
  <Link key={club.id} href={`/club/${club.id}`}>
    <ClubCard club={club} />
  </Link>
);

export default ClubsList;
