import UserNotifications from '@/app/inbox/notifications';
import { getQueryClient, trpc } from '@/components/trpc/server';

const Page = async () => {
  const queryClient = getQueryClient();
  queryClient.prefetchQuery({
    queryKey: trpc.user.authNotifications.queryKey(),
  });
  return <UserNotifications />;
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
