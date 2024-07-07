import { ProfileProps } from '@/app/user/[username]/page';
import { FC } from 'react';

const GuestContent: FC<{ props: ProfileProps }> = (data) => {
  return (
    <div className="w-full">
      you're a guest on this page
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default GuestContent;
