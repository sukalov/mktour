import { FC, PropsWithChildren } from 'react';

const Badge: FC<
  PropsWithChildren & { className?: string; isMobile: boolean }
> = ({ children, className, isMobile }) => {
  return (
    <div
      className={`absolute top-0 ${isMobile ? '-right-0.5' : '-right-2'} bg-destructive size-2 rounded-full ${className}`}
    >
      {children}
    </div>
  );
};

export default Badge;
