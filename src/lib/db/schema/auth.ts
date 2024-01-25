import { InferSelectModel } from 'drizzle-orm';
import { sqliteTable, text, int, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('user', {
  id: text('id').primaryKey(),
  name: text('name'),
  email: text('email').notNull(),
  username: text('username').notNull(),
  lichess_blitz: int('lichess_blitz'),
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
