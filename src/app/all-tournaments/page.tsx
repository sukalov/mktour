import { Card } from '@/components/ui/card';
import useAllTournamentsQuery from '@/lib/db/hooks/useAllTournamentsQuery';

export default async function Tournaments() {
  const { allTournaments } = await useAllTournamentsQuery();
  console.log(allTournaments);
  return (
    <main className="flex flex-col items-center">
      {allTournaments.map(TournamentIteratee)}
    </main>
  );
}

const TournamentIteratee = (props: any) => {
  return (
    <Card className="m-2 flex min-w-[300px] flex-col gap-2 p-4">
      <div>{props.title}</div>
      <div>{props.format}</div>
      <div>{props.type}</div>
      <div>{props.date}</div>
    </Card>
  );
};
