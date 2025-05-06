import { users } from '@/lib/db/schema/auth'; // Assuming these exist
import { clubs, players } from '@/lib/db/schema/tournaments'; // Assuming these exist
import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import {
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core';

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

export type AffiliationStatus =
  | 'requested' // by user
  | 'approved' //by club
  | 'removed' // by club
  | 'set_manually' // by club
  | 'cancelled'; // by user

// user_id: the user of mktour used with lichess account who initiated the affiliation
// player_id: the actual player being affiliated
export const affiliations = sqliteTable(
  'affiliation',
  {
    id: text('id').primaryKey(),
    user_id: text('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    club_id: text('club_id')
      .references(() => clubs.id, { onDelete: 'cascade' })
      .notNull(),
    player_id: text('player_id')
      .references(() => players.id, { onDelete: 'cascade' })
      .notNull(),
    status: text('status').$type<AffiliationStatus>().notNull(),
    created_at: integer('created_at', { mode: 'timestamp' })
      .$default(() => new Date())
      .notNull(),
    updated_at: integer('updated_at', { mode: 'timestamp' })
      .$default(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex('affiliation_user_club_unique_idx').on(
      table.user_id,
      table.club_id,
    ),
  ],
);

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

export const affiliations_relations = relations(affiliations, ({ one }) => ({
  user: one(users, {
    fields: [affiliations.user_id],
    references: [users.id],
  }),
  club: one(clubs, {
    fields: [affiliations.club_id],
    references: [clubs.id],
  }),
  player: one(players, {
    fields: [affiliations.player_id],
    references: [players.id],
  }),
}));

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

export type DatabaseAffiliation = InferSelectModel<typeof affiliations>;
export type InsertDatabaseAffiliation = InferInsertModel<typeof affiliations>;

export type DatabaseNotification = InferSelectModel<typeof notifications>;
export type InsertDatabaseNotification = InferInsertModel<typeof notifications>;

// Example Usage Flow:
// 1. User clicks "Request Affiliation" for Club X.
//    - Application creates an `affiliations` record: { user_id: user.id, club_id: clubX.id, player_id: player.id, status: 'pending', ... }
//      (This notification is *for* the club).
//    - Application creates a `notifications` record: { user_id: user.id, club_id: clubX.id, for_whom: 'club', notification_type: 'affiliation_request', metadata: { affiliation_id: newAffiliation.id }, ... }
// 2. Club Admin sees the request notification and approves it.
//    - Application updates the `affiliations` record: status = 'approved', updated_at = now()
//    - Application creates a `notifications` record: { user_id: user.id, club_id: clubX.id, for_whom: 'user', notification_type: 'affiliation_approved', metadata: { affiliation_id: affiliation.id }, ... }
//      (This notification is *for* the user).
