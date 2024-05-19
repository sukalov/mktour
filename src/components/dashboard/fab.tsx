'use client';

import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { FC, SetStateAction } from 'react';
import { IconType } from 'react-icons';

const Fab: FC<FabProps> = ({ onClick }) => {
  return (
    <Button
      className="fixed bottom-8 right-6 rounded-full transition-all duration-500"
      variant="secondary"
      size="icon"
      style={{ scale: 1.5 }}
      onClick={onClick}
    >
      <UserPlus className="h-4 w-4" />
    </Button>
  );
};

type FabProps = {
  onClick?: SetStateAction<any>;
  icon?: IconType;
};

export default Fab;
