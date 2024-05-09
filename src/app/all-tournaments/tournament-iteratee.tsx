'use client';

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DatabaseTournament } from '@/lib/db/schema/tournaments';
import { useRouter } from 'next/navigation';
import { FC } from 'react';

const TournamentsContainer: FC<{ props: DatabaseTournament[] }> = ({
  props,
}) => {
  return <>{props.map(TournamentIteratee)}</>;
};

const TournamentIteratee = (props: DatabaseTournament) => {
  const navigate = useRouter();
  return (
    <Card
      key={props.id}
      className="flex w-full flex-col"
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

export default TournamentsContainer;
