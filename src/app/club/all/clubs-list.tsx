'use client';

import ClubCard from '@/app/club/club-card';
import { DatabaseClub } from '@/lib/db/schema/tournaments';
import Link from 'next/link';
import { FC } from 'react';

const ClubsList: FC<{ clubs: DatabaseClub[] }> = ({ clubs }) =>
  clubs.map((club) => <ClubItemIteratee key={club.id} club={club} />);

const ClubItemIteratee = ({ club }: { club: DatabaseClub }) => (
  <Link href={`/club/${club.id}`}>
    <ClubCard club={club} />
  </Link>
);

export default ClubsList;
