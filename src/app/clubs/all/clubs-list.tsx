import ClubCard from '@/app/clubs/club-card';
import { DatabaseClub } from '@/server/db/schema/clubs';
import { FC } from 'react';

const ClubsIteratee: FC<{ clubs: DatabaseClub[] }> = ({ clubs }) =>
  clubs.map((club) => <ClubCard key={club.id} club={club} />);

export default ClubsIteratee;
