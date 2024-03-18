import { TournamentContext } from '@/app/tournament/[id]/tournament-context';
import { Card } from '@/components/ui/card';
import { useContext } from 'react';

const Main = () => {
  const { tournament } = useContext(TournamentContext);

  return (
    <Card className='flex flex-col gap-8 p-4' >
      <div >{tournament?.title}</div>
      <div className="flex flex-row self-end gap-2 text-xs font-thin">
        <span>{tournament?.type}</span>
        <div>{tournament?.format}</div>
        <div>{tournament?.date}</div>
      </div>
      {/* <span>{tournament?.is_closed}</span> */}
    </Card>
  );
};

export default Main;
