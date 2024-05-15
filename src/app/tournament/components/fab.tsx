'use client';

import { DashboardContext } from '@/app/tournament/[id]/dashboard-context';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { FC, useContext } from 'react';

const Fab: FC<any> = ({ currentTab }) => {
  const { tournament, sendJsonMessage } = useContext(DashboardContext)


  return (
    <Button
      className="fixed bottom-8 right-6 rounded-full transition-all duration-500"
      variant="secondary"
      size="icon"
      style={{ scale: 1.5 }}
    >
      <UserPlus className="h-4 w-4" />
    </Button>
  );
};

export default Fab;
