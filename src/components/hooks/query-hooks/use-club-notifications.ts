import { DatabaseNotification } from '@/lib/db/schema/notifications';
import { DatabaseAffiliation } from '@/lib/db/schema/players';
import { useQuery } from '@tanstack/react-query';

export const useClubNotifications = (clubId: string) => {
  return useQuery({
    queryKey: [clubId, 'club', 'notifications'],
    queryFn: async (): Promise<
      {
        notification: DatabaseNotification;
        affiliation: DatabaseAffiliation | null;
      }[]
    > => {
      const response = await fetch('/api/club/notifications');
      if (!response.ok) {
        throw new Error('failed to fetch notifications');
      }
      return response.json();
    },
    staleTime: 1000 * 60 * 60,
  });
};
