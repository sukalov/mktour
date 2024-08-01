import { FC, HTMLAttributes, PropsWithChildren } from 'react';

const Center: FC<
  PropsWithChildren & {
    className?: HTMLAttributes<HTMLDivElement>['className'];
  }
> = ({ children, className }) => (
  <div className={`flex justify-center px-8 py-4 ${className}`}>{children}</div>
);

export default Center;
