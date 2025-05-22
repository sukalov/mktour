import UserNotifications from '@/app/inbox/notifications';
import { makeProtectedCaller } from '@/server/api';

const Page = async () => {
  const protectedCaller = await makeProtectedCaller();
  const notifications = protectedCaller.user.authNotifications();
  // const groupedNotifications = groupAffiliationNotificationsByClub(notificatioins);

  return <UserNotifications notificationsPromise={notifications} />;
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
