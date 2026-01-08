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
      'bg-background sm:bg-card border-none shadow-none sm:border-solid sm:shadow',
      className,
    )}
    {...props}
  >
    {children}
  </Card>
));
HalfCard.displayName = 'HalfCard';

export default HalfCard;
