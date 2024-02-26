'use client';

import { Card } from '@/components/ui/card';
import { Format, TournamentType } from '@/types/tournaments';
import { useRouter } from 'next/navigation';
import { FC } from 'react';

const TournamentsContainer: FC<{ props: TournamentProps[] }> = ({ props }) => {
  return <>{props.map(TournamentIteratee)}</>;
};

const TournamentIteratee = (props: TournamentProps) => {
  const navigate = useRouter();
  return (
    <Card
      className="m-2 flex min-w-[300px] flex-col gap-2 p-4"
      onClick={() => navigate.push(`/tournament/${props.id}`)}
    >
      <div>{props.title}</div>
      <div>{props.format}</div>
      <div>{props.type}</div>
      <div>{props.date}</div>
    </Card>
  );
};

type TournamentProps = {
  id: string;
  title: string | null;
  date: string | null;
  format: Format | null;
  type: TournamentType | null;
  timestamp: number | null;
  club_id: string;
  is_started: boolean | null;
  is_closed: boolean | null;
};

export default TournamentsContainer;
