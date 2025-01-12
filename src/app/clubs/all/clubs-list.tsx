'use client';

import ClubCard from '@/app/clubs/club-card';
import { DatabaseClub } from '@/lib/db/schema/tournaments';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useRouter } from 'next/navigation';
import { FC } from 'react';

const ClubsList: FC<{ clubs: DatabaseClub[] }> = ({ clubs }) => {
  const router = useRouter();
  return clubs.map((club) => (
    <ClubItemIteratee key={club.id} club={club} router={router} />
  ));
};

const ClubItemIteratee = ({
  club,
  router,
}: {
  club: DatabaseClub;
  router: AppRouterInstance;
}) => (
  <div onClick={() => router.push(`/club/${club.id}`)}>
    <ClubCard club={club} />
  </div>
);

export default ClubsList;
