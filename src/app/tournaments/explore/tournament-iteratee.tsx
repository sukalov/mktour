import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DatabaseTournament } from '@/lib/db/schema/tournaments';
import Link from 'next/link';
import { FC } from 'react';

const TournamentsContainer: FC<{ props: DatabaseTournament[] }> = ({
  props,
}) => {
  return <>{props.map(TournamentIteratee)}</>;
};

const TournamentIteratee = (props: DatabaseTournament) => {
  return (
    <Link href={`/tournament/${props.id}`} className="flex w-full flex-col">
      <Card key={props.id}>
        <CardHeader>
          <CardTitle className="">{props.title}</CardTitle>
          <CardDescription className="flex gap-2">
            <span>{props.date}</span>
            <span>{props.format}</span>
            <span>{props.type}</span>
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
};

export default TournamentsContainer;
