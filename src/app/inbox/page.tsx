/* eslint-disable */
// FIXME eslint

import UserNotifications from '@/app/inbox/notifications';
import { getQueryClient, trpc } from '@/components/trpc/server';
import {
  cachedValidateRequest,
  reactCachedValidateRequest,
  validateRequest,
} from '@/lib/auth/lucia';
import { connection } from 'next/server';
import { Suspense } from 'react';

const InboxPage = async () => {
  await connection();
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: trpc.user.authNotifications.queryKey(),
  });

  // Measure validateRequest
  const startTime1 = performance.now();
  await validateRequest();
  const endTime1 = performance.now();
  console.log(`validateRequest (NO CACHE) took${endTime1 - startTime1}ms`);

  // Measure reactCachedValidateRequest
  const startTime3 = performance.now();
  await reactCachedValidateRequest();
  const endTime3 = performance.now();
  console.log(`reactCachedValidateRequest took ${endTime3 - startTime3}ms`);

  const startTime2 = performance.now();
  await cachedValidateRequest();
  const endTime2 = performance.now();
  console.log(`cachedValidateRequest took ${endTime2 - startTime2}ms`);
  return (
    <>
      <UserNotifications />
      {`validateRequest took ${endTime1 - startTime1}ms`}
      <br />
      {`reactCachedValidateRequest took ${endTime3 - startTime3}ms`}
      <br />
      {`cachedValidateRequest took ${endTime2 - startTime2}ms`}
    </>
  );
};

const Page = async () => {
  return (
    <Suspense fallback={<p>loading...</p>}>
      <InboxPage />
    </Suspense>
  );
};

export default Page;
