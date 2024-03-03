import { clubs } from '@/lib/db/schema/tournaments';
import { InferSelectModel } from 'drizzle-orm';
import { int, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('user', {
  id: text('id').primaryKey(),
  name: text('name'),
  email: text('email').notNull().unique(),
  username: text('username').notNull().unique(),
  rating: int('rating'),
  default_club: text('default_club').references(() => clubs.id).notNull()
});

export const sessions = sqliteTable('user_session', {
  id: text('id').notNull().primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  expiresAt: integer('expires_at').notNull(),
});

export type DatabaseSession = InferSelectModel<typeof sessions>;
export type DatabaseUser = InferSelectModel<typeof users>;
