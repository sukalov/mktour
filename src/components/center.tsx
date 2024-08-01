import { FC, HTMLAttributes, PropsWithChildren } from 'react';

const Center: FC<
  PropsWithChildren & {
    className?: HTMLAttributes<HTMLDivElement>['className'];
  }
> = ({ children, className }) => (
  <div className={`flex justify-center p-4 ${className}`}>{children}</div>
);

export default Center;
