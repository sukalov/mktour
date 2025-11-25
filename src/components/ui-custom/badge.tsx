import { FC, PropsWithChildren } from 'react';

const Badge: FC<PropsWithChildren & { className?: string }> = ({
  children,
  className,
}) => {
  return (
    <div
      className={`bg-destructive absolute -top-1 -right-1 m-auto size-2 rounded-full sm:top-0 sm:-right-2 ${className}`}
    >
      {children}
    </div>
  );
};

export const BadgeWithCount: FC<
  PropsWithChildren & {
    count: number;
    className?: string;
    isMobile?: boolean;
  }
> = ({ count, className }) => {
  const countLabel = count > 99 ? '99+' : String(count);
  const sizeClass =
    count > 99 ? 'text-3xs' : count > 9 ? 'text-2xs' : 'text-xs';

  return (
    <Badge
      className={`bg-foreground text-background static flex size-4 items-center justify-center font-bold ${sizeClass} ${className}`}
      aria-label={`Unread notifications: ${countLabel}`}
    >
      {countLabel}
    </Badge>
  );
};

export default Badge;
