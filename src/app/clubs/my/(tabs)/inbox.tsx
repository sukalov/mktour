'use client';

import Empty from '@/components/empty';
import {
  ClubNotificationsResult,
  useClubNotifications,
} from '@/components/hooks/query-hooks/use-club-notifications';
import { AffiliationNotificationLi } from '@/components/notification-items';
import SkeletonList from '@/components/skeleton-list';
import { ClubNotification } from '@/server/queries/get-club-notifications';
import { useTranslations } from 'next-intl';
import { FC } from 'react';

const ClubInbox: FC<{ selectedClub: string }> = ({ selectedClub }) => {
  const t = useTranslations('Club.Inbox');
  const notifications = useClubNotifications(selectedClub);

  if (!notifications) return null;
  if (notifications.status === 'pending') return <SkeletonList />;
  if (notifications.status === 'error')
    return <p>{notifications.error.message}</p>;
  if (!notifications.data.length) return <Empty>{t('empty')}</Empty>;
  return (
    <div className="mk-list">
      {notifications.data.map(NotificationItemIteratee)}
    </div>
  );
};

const NotificationItemIteratee = (data: ClubNotification) => {
  if (data.type === 'affiliation_request')
    return <AffiliationNotificationLi key={data.notification.id} {...data} />;
  return null;
};

// @ts-expect-error-mock-data
export const mockClubNotifications: ClubNotificationsResult = {
  data: [
    {
      notification: {
        id: '1',
        created_at: new Date(),
        club_id: 'club1',
        notification_type: 'affiliation_request',
        is_seen: true,
        metadata: null,
      },
      type: 'affiliation_request',
      affiliation: {
        id: 'aff1',
        user_id: 'user1',
        club_id: 'club1',
        player_id: 'player1',
        status: 'requested',
        created_at: new Date(),
        updated_at: new Date(),
      },
      user: {
        id: 'user1',
        name: 'John Doe',
        email: 'johndoe@example.com',
        username: 'johndoe',
        rating: 1200,
        selected_club: 'club1',
        created_at: new Date(),
      },
      player: {
        id: 'player1',
        nickname: 'AcePlayer',
        realname: 'John Doe',
        user_id: 'user1',
        rating: 1500,
        club_id: 'club1',
        last_seen: 0,
      },
    },
    {
      notification: {
        id: '2',
        created_at: new Date(),
        club_id: 'club2',
        notification_type: 'affiliation_request',
        is_seen: false,
        metadata: null,
      },
      type: 'affiliation_request',
      affiliation: {
        id: 'aff2',
        user_id: 'user2',
        club_id: 'club2',
        player_id: 'player2',
        status: 'active',
        created_at: new Date(),
        updated_at: new Date(),
      },
      user: {
        id: 'user2',
        name: 'Jane Smith',
        email: 'janesmith@example.com',
        username: 'janesmith',
        rating: 1300,
        selected_club: 'club2',
        created_at: new Date(),
      },
      player: {
        id: 'player2',
        nickname: 'ProGamer',
        realname: 'Jane Smith',
        user_id: 'user2',
        rating: 1600,
        club_id: 'club2',
        last_seen: 0,
      },
    },
  ],
};

export default ClubInbox;
