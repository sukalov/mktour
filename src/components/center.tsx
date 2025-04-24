import { FC, HTMLAttributes, PropsWithChildren } from 'react';

const Center: FC<
  PropsWithChildren & {
    className?: HTMLAttributes<HTMLDivElement>['className'];
  }
> = ({ children, className }) => (
  <div className={`mk-container flex justify-center ${className}`}>
    {children}
  </div>
);

export default Center;
