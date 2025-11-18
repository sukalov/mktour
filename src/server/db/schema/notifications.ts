import { clubs } from '@/server/db/schema/clubs';
import { users } from '@/server/db/schema/users';
import {
  ClubNotificationEvent,
  UserNotificationEvent,
} from '@/types/notifications';
import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const user_notifications = sqliteTable('user_notification', {
  id: text('id').primaryKey(),
  created_at: integer('created_at', { mode: 'timestamp' })
    .$default(() => new Date())
    .notNull(),
  user_id: text('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  event: text('event').$type<UserNotificationEvent>().notNull(),
  is_seen: integer('is_seen', { mode: 'boolean' })
    .$default(() => false)
    .notNull(),
  metadata: text('metadata', {
    mode: 'json',
  })
    .$type<Record<string, unknown>>()
    .notNull()
    .$default(() => ({ test: 'test' })),
});

export const club_notifications = sqliteTable('club_notification', {
  id: text('id').primaryKey(),
  created_at: integer('created_at', { mode: 'timestamp' })
    .$default(() => new Date())
    .notNull(),
  club_id: text('club_id')
    .references(() => clubs.id, { onDelete: 'cascade' })
    .notNull(),
  event: text('event').$type<ClubNotificationEvent>().notNull(),
  is_seen: integer('is_seen', { mode: 'boolean' })
    .$default(() => false)
    .notNull(),
  metadata: text('metadata', {
    mode: 'json',
  })
    .$type<Record<string, unknown>>()
    .notNull()
    .$default(() => ({ test: 'test' })),
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
