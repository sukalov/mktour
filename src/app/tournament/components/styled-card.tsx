import { Card } from '@/components/ui/card';
import { FC, PropsWithChildren } from 'react';

const StyledCard: FC<PropsWithChildren> = ({ children }) => (
  <Card className="min-h-16 flex w-full flex-col items-center justify-center p-2">
    {children}
  </Card>
);

export default StyledCard;
