'use client';

import { Button } from '@/components/ui/button';
import { Loader2, LucideIcon } from 'lucide-react';
import { FC, SetStateAction } from 'react';

const Fab: FC<FabProps> = ({ onClick, icon: Icon, disabled }) => {
  return (
    <Button
      className="fixed bottom-8 right-6 rounded-full transition-all duration-500"
      variant="secondary"
      size="icon"
      style={{ scale: 1.5 }}
      onClick={onClick}
      disabled={disabled}
>
      <Icon className={`h-4 w-4 ${Icon === Loader2 && 'animate-spin'}`} />
    </Button>
  );
};

type FabProps = {
  onClick?: SetStateAction<any>;
  icon: LucideIcon;
  disabled: boolean;
};

export default Fab;
