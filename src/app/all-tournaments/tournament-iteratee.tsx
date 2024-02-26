'use client';

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
      key={props.id}
      className="flex w-[350px] flex-col"
      onClick={() => navigate.push(`/tournament/${props.id}`)}
    >
      <CardHeader>
        <CardTitle className="">{props.title}</CardTitle>
        <CardDescription className="flex gap-2">
          <span>{props.date}</span>
          <span>{props.format}</span>
          <span>{props.type}</span>
        </CardDescription>
      </CardHeader>
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
