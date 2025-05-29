import { clubs } from '@/server/db/schema/clubs';
import { users } from '@/server/db/schema/users';
import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export type SenderType = 'user' | 'club';
export type UserNotificationType =
  | 'affiliation_approved' // Club approves request
  | 'affiliation_rejected' // Club rejects request
  //   | 'affiliation_cancelled' // User cancels their pending request
  //   | 'affiliation_removed' // Club removes an existing affiliation
  | 'tournament_won'
  | 'became_club_manager';
//   | 'manual_affiliation_added' // e.g., Admin manually links user/player
//   | 'role_change_request' // e.g., User requests admin role
//   | 'role_change_approved'
//   | 'role_change_rejected';
export type UserNotificationMetadata<
  T extends UserNotificationType = UserNotificationType,
> = T extends 'affiliation_approved' | 'affiliation_rejected'
  ? {
      club_id: string;
      affiliation_id: string;
    }
  : T extends 'tournament_won'
    ? {
        tournament_id: string;
      }
    : T extends 'became_club_manager'
      ? {
          club_id: string;
          role: 'co-owner' | 'admin';
        }
      : never;

export type ClubNotificationType = 'affiliation_request' | 'manager_left'; // User requests to join club (creates pending affiliation)
export type ClubNotificationMetadata<
  T extends ClubNotificationType = ClubNotificationType,
> = T extends 'affiliation_request'
  ? {
      user_id: string;
      affiliation_id: string;
    }
  : T extends 'manager_left'
    ? { userId: string }
    : never; // TODO not yet implemented in "leave club" mutation

// all notifications are stored in one table
// each notifiation is an interaction between a club and a user
// one of them is trigger, the other receives the notification
export const user_notifications = sqliteTable('user_notification', {
  id: text('id').primaryKey(),
  created_at: integer('created_at', { mode: 'timestamp' })
    .$default(() => new Date())
    .notNull(),
  user_id: text('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  notification_type: text('notification_type')
    .$type<UserNotificationType>()
    .notNull(),
  is_seen: integer('is_seen', { mode: 'boolean' })
    .$default(() => false)
    .notNull(),
  metadata: text('metadata', {
    mode: 'json',
  }).$type<UserNotificationMetadata>(),
});

export const club_notifications = sqliteTable('club_notification', {
  id: text('id').primaryKey(),
  created_at: integer('created_at', { mode: 'timestamp' })
    .$default(() => new Date())
    .notNull(),
  club_id: text('club_id')
    .references(() => clubs.id, { onDelete: 'cascade' })
    .notNull(),
  notification_type: text('notification_type')
    .$type<ClubNotificationType>()
    .notNull(),
  is_seen: integer('is_seen', { mode: 'boolean' })
    .$default(() => false)
    .notNull(),
  metadata: text('metadata', {
    mode: 'json',
  }).$type<ClubNotificationMetadata>(),
});

export const user_notifications_relations = relations(
  user_notifications,
  ({ one }) => ({
    user: one(users, {
      fields: [user_notifications.user_id],
      references: [users.id],
    }),
  }),
);

export const club_notifications_relations = relations(
  club_notifications,
  ({ one }) => ({
    club: one(clubs, {
      fields: [club_notifications.club_id],
      references: [clubs.id],
    }),
  }),
);

export type DatabaseUserNotification = InferSelectModel<
  typeof user_notifications
>;
export type DatabaseClubNotification = InferSelectModel<
  typeof club_notifications
>;
export type InsertDatabaseUserNotification = InferInsertModel<
  typeof user_notifications
>;
export type InsertDatabaseClubNotification = InferInsertModel<
  typeof club_notifications
>;
