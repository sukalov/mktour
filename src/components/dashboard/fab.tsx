'use client';

import { DashboardContext } from '@/components/dashboard/dashboard-context';
import { onClickAddNewPlayer } from '@/components/dashboard/helpers/on-click-handlers';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { FC, useContext } from 'react';

const Fab: FC = () => {
  const { sendJsonMessage } = useContext(DashboardContext);

  return (
    <Button
      className="fixed bottom-8 right-6 rounded-full transition-all duration-500"
      variant="secondary"
      size="icon"
      style={{ scale: 1.5 }}
      onClick={() => onClickAddNewPlayer(sendJsonMessage)}
    >
      <UserPlus className="h-4 w-4" />
    </Button>
  );
};

export default Fab;
