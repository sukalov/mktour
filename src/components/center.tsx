import { FC, HTMLAttributes, PropsWithChildren } from 'react';

const Center: FC<
  PropsWithChildren & {
    className?: HTMLAttributes<HTMLDivElement>['className'];
  }
> = ({ children, className }) => (
  <div className={`flex justify-center mk-container ${className}`}>{children}</div>
);

export default Center;
