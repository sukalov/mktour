import UserNotifications from '@/app/inbox/notifications';
import getUserNotifications, {
  AffiliationNotification,
} from '@/lib/actions/get-user-notifications';

const Page = async () => {
  const res = await getUserNotifications();
  const groupedNotifications = groupAffiliationNotificationsByClub(res);

  console.log(res);

  return <UserNotifications groupedNotifications={groupedNotifications} />;
};

const groupAffiliationNotificationsByClub = (
  notifications: AffiliationNotification[],
) => {
  const groupedNotifications = notifications.reduce(
    (acc, notification) => {
      if (!notification.clubName) {
        return acc;
      }
      const clubName = notification.clubName;
      if (!acc[clubName]) {
        acc[clubName] = [];
      }
      acc[clubName].push(notification);
      return acc;
    },
    {} as Record<string, AffiliationNotification[]>,
  );

  return groupedNotifications;
};

export default Page;
