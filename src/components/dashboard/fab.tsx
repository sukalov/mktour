'use client';

import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';
import { FC, SetStateAction } from 'react';

const Fab: FC<FabProps> = ({ onClick, icon: Icon }) => {
  return (
    <Button
      className="fixed bottom-8 right-6 rounded-full transition-all duration-500"
      variant="secondary"
      size="icon"
      style={{ scale: 1.5 }}
      onClick={onClick}
    >
      <Icon className='h-4 w-4'/>
    </Button>
  );
};

type FabProps = {
  onClick?: SetStateAction<any>;
  icon: LucideIcon;
};

export default Fab;
