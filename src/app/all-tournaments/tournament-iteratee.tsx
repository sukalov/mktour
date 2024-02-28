'use client';

import { TournamentProps } from '@/app/tournament/[id]/dashboard';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
