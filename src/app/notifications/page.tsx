import UserNotifications from '@/app/notifications/notifications';
import Loading from '@/app/loading';
import { getQueryClient, trpc } from '@/components/trpc/server';
import { connection } from 'next/server';
import { Suspense } from 'react';

const InboxPage = async () => {
  await connection();
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: trpc.auth.notifications.infinite.queryKey(),
  });

  return <UserNotifications />;
};

const Page = async () => {
  return (
    <Suspense fallback={<Loading />}>
      <InboxPage />
    </Suspense>
  );
};

export default Page;
