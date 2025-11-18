import type {
  DatabaseClubNotification,
  DatabaseUserNotification,
} from '@/server/db/schema/notifications';

type UserNotificationEvent =
  | 'affiliation_approved'
  | 'affiliation_rejected'
  | 'tournament_won'
  | 'became_club_manager'
  | 'removed_from_club_managers';

type ClubNotificationEvent =
  | 'affiliation_request'
  | 'manager_left'
  | 'affiliation_request_approved'
  | 'affiliation_request_rejected';

type UserNotificationMetadata = {
  affiliation_approved: { club_id: string; affiliation_id: string };
  affiliation_rejected: { club_id: string; affiliation_id: string };
  tournament_won: { tournament_id: string; name: string };
  became_club_manager: { club_id: string; role: 'co-owner' | 'admin' };
  removed_from_club_managers: { club_id: string };
};

type ClubNotificationMetadata = {
  affiliation_request: { user_id: string; affiliation_id: string };
  manager_left: { user_id: string };
  affiliation_request_approved: { user_id: string; affiliation_id: string };
  affiliation_request_rejected: { user_id: string; affiliation_id: string };
};

// typed notifications (database + typed metadata)
type UserNotification<T extends UserNotificationEvent> = Omit<
  DatabaseUserNotification,
  'event' | 'metadata'
> & {
  event: T;
  metadata: UserNotificationMetadata[T];
};

type ClubNotification<T extends ClubNotificationEvent> = Omit<
  DatabaseClubNotification,
  'event' | 'metadata'
> & {
  event: T;
  metadata: ClubNotificationMetadata[T];
};

// union of all typed notifications
type AnyUserNotification = {
  [K in UserNotificationEvent]: UserNotification<K>;
}[UserNotificationEvent];

type AnyClubNotification = {
  [K in ClubNotificationEvent]: ClubNotification<K>;
}[ClubNotificationEvent];

type AnyNotification = AnyUserNotification | AnyClubNotification;

// ============================================================================
// websocket message types
// ============================================================================

// generic websocket messages tied to events
interface UserWebSocketMessage<T extends UserNotificationEvent> {
  type: 'user';
  event: T;
  recipientId: string;
}

interface ClubWebSocketMessage<T extends ClubNotificationEvent> {
  type: 'club';
  event: T;
  recipientClubId: string;
}

// additional properties for specific messages
interface AffiliationApprovedWSMessage
  extends UserWebSocketMessage<'affiliation_approved'> {
  clubId: string;
}

interface AffiliationRejectedWSMessage
  extends UserWebSocketMessage<'affiliation_rejected'> {
  clubId: string;
}

// union of all websocket messages
type AnyUserWebSocketMessage =
  | UserWebSocketMessage<'removed_from_club_managers'>
  | UserWebSocketMessage<'became_club_manager'>
  | AffiliationApprovedWSMessage
  | AffiliationRejectedWSMessage
  | UserWebSocketMessage<'tournament_won'>;

type AnyClubWebSocketMessage =
  | ClubWebSocketMessage<'affiliation_request'>
  | ClubWebSocketMessage<'manager_left'>
  | ClubWebSocketMessage<'affiliation_request_approved'>
  | ClubWebSocketMessage<'affiliation_request_rejected'>;

// error message
type GlobalErrorMessage = {
  recipientId: string;
  type: 'error';
  event: 'error';
  message: string;
};

// all possible global websocket messages
type GlobalMessage =
  | AnyUserWebSocketMessage
  | AnyClubWebSocketMessage
  | GlobalErrorMessage;
