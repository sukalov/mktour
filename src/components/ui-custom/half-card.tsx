import * as React from 'react';

import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const HalfCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => (
  <Card
    ref={ref}
    className={cn(
      'bg-background md:bg-card smborder-solid border-none shadow-none md:shadow-2xl',
      className,
    )}
    {...props}
  >
    {children}
  </Card>
));
HalfCard.displayName = 'HalfCard';

export default HalfCard;
