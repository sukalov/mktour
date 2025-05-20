import { notifications } from '@/server/db/schema/notifications';
import { affiliations, players } from '@/server/db/schema/players';
import { tournaments } from '@/server/db/schema/tournaments';
import { users } from '@/server/db/schema/users';
import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const clubs = sqliteTable('club', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull(),
  lichess_team: text('lichess_team'),
});

export const clubs_to_users = sqliteTable('clubs_to_users', {
  id: text('id').primaryKey(),
  club_id: text('club_id')
    .notNull()
    .references(() => clubs.id),
  user_id: text('user_id')
    .notNull()
    .references(() => users.id),
  status: text('status').notNull().$type<StatusInClub>(),
});

export const clubs_relations = relations(clubs, ({ many }) => ({
  tournaments: many(tournaments),
  players: many(players),
  notifications: many(notifications), // user can be involved in many notifications
  affiliations: many(affiliations),
}));

export type StatusInClub = 'admin' | 'co-owner';

export type DatabaseClub = InferSelectModel<typeof clubs>;
export type DatabaseClubsToUsers = InferSelectModel<typeof clubs_to_users>;
export type InsertDatabaseClub = InferInsertModel<typeof clubs>;
export type InsertDatabaseClubsToUsers = InferInsertModel<
  typeof clubs_to_users
>;
