import UserNotifications from '@/app/inbox/notifications';
import { getQueryClient, trpc } from '@/components/trpc/server';
import {
  reactCachedValidateRequest,
  uncachedValidateRequest,
  validateRequest,
} from '@/lib/auth/lucia';

const Page = async () => {
  const queryClient = getQueryClient();
  queryClient.prefetchQuery({
    queryKey: trpc.user.authNotifications.queryKey(),
  });

  // Measure validateRequest
  const startTime1 = Date.now();
  await validateRequest();
  const endTime1 = Date.now();
  console.log(`validateRequest took ${endTime1 - startTime1}ms`);

  // Measure uncachedValidateRequest
  const startTime2 = Date.now();
  await uncachedValidateRequest();
  const endTime2 = Date.now();
  console.log(`uncachedValidateRequest took ${endTime2 - startTime2}ms`);

  // Measure reactCachedValidateRequest
  const startTime3 = Date.now();
  await reactCachedValidateRequest();
  const endTime3 = Date.now();
  console.log(`reactCachedValidateRequest took ${endTime3 - startTime3}ms`);

  return (
    <>
      <UserNotifications />
      {`validateRequest took ${endTime1 - startTime1}ms`}
      {`uncachedValidateRequest took ${endTime2 - startTime2}ms`}
      {`reactCachedValidateRequest took ${endTime3 - startTime3}ms`}
    </>
  );
};

// const groupAffiliationNotificationsByClub = (
//   notifications: AffiliationNotification[],
// ) => {
//   const groupedNotifications = notifications.reduce(
//     (acc, notification) => {
//       if (!notification.clubName) {
//         return acc;
//       }
//       const clubName = notification.clubName;
//       if (!acc[clubName]) {
//         acc[clubName] = [];
//       }
//       acc[clubName].push(notification);
//       return acc;
//     },
//     {} as Record<string, AffiliationNotification[]>,
//   );

//   return groupedNotifications;
// };

export default Page;
