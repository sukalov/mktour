import { clubs } from '@/server/db/schema/clubs';
import { users } from '@/server/db/schema/users';
import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export type SenderType = 'user' | 'club';
export type NotificationType =
  | 'affiliation_request' // User requests to join club (creates pending affiliation)
  | 'affiliation_approved' // Club approves request
  | 'affiliation_rejected'; // Club rejects request
//   | 'affiliation_cancelled' // User cancels their pending request
//   | 'affiliation_removed' // Club removes an existing affiliation
//   | 'tournament_won'
//   | 'manual_affiliation_added' // e.g., Admin manually links user/player
//   | 'role_change_request' // e.g., User requests admin role
//   | 'role_change_approved'
//   | 'role_change_rejected';

export type NotificationMetadataType = {
  tournament_id?: string;
  affiliation_id?: string;
};

// all notifications are stored in one table
// each notifiation is an interaction between a club and a user
// one of them is trigger, the other receives the notification
export const notifications = sqliteTable('notification', {
  id: text('id').primaryKey(),
  created_at: integer('created_at', { mode: 'timestamp' })
    .$default(() => new Date())
    .notNull(),
  user_id: text('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  club_id: text('club_id')
    .references(() => clubs.id, { onDelete: 'cascade' })
    .notNull(),
  for_whom: text('for_whom').$type<SenderType>().notNull(),
  notification_type: text('notification_type')
    .$type<NotificationType>()
    .notNull(),
  is_seen: integer('is_seen', { mode: 'boolean' })
    .$default(() => false)
    .notNull(),
  metadata: text('metadata', {
    mode: 'json',
  }).$type<NotificationMetadataType>(),
});

// Define relations for the notifications table
export const notifications_relations = relations(notifications, ({ one }) => ({
  // Each notification involves one user
  user: one(users, {
    fields: [notifications.user_id],
    references: [users.id],
  }),
  // Each notification involves one club
  club: one(clubs, {
    fields: [notifications.club_id],
    references: [clubs.id],
  }),
}));

export type DatabaseNotification = InferSelectModel<typeof notifications>;
export type InsertDatabaseNotification = InferInsertModel<typeof notifications>;
