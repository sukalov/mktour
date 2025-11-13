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
    queryKey: trpc.user.auth.notifications.queryKey(),
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

  // Measure validateRequest
  const s1 = performance.now();
  await validateRequest();
  const e1 = performance.now();
  console.log(`validateRequest (NO CACHE) took${e1 - s1}ms`);

  // Measure reactCachedValidateRequest
  const s3 = performance.now();
  await reactCachedValidateRequest();
  const e3 = performance.now();
  console.log(`reactCachedValidateRequest took ${e3 - s3}ms`);

  const s2 = performance.now();
  await cachedValidateRequest();
  const e2 = performance.now();
  console.log(`cachedValidateRequest took ${e2 - s2}ms`);
  return (
    <>
      <UserNotifications />
      {`1st validateRequest took ${endTime1 - startTime1}ms`}
      <br />
      {`1st reactCachedValidateRequest took ${endTime3 - startTime3}ms`}
      <br />
      {`1st cachedValidateRequest took ${endTime2 - startTime2}ms`}
      <br />
      {`2nd validateRequest took ${e1 - s1}ms`}
      <br />
      {`2nd reactCachedValidateRequest took ${e3 - s3}ms`}
      <br />
      {`2nd cachedValidateRequest took ${e2 - s2}ms`}
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
