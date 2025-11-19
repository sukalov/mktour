import { clubs } from '@/server/db/schema/clubs';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { int, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';

export const users = sqliteTable('user', {
  id: text('id').primaryKey(),
  name: text('name'),
  email: text('email').notNull().unique(),
  username: text('username').notNull().unique(),
  rating: int('rating'),
  selected_club: text('selected_club')
    .references(() => clubs.id)
    .notNull(),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const user_preferences = sqliteTable('user_preferences', {
  user_id: text('user_id')
    .primaryKey()
    .references(() => users.id),
  language: text('language').$default(() => 'en'),
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
export type InsertDatabaseSession = InferInsertModel<typeof sessions>;
export type InsertDatabaseUser = InferInsertModel<typeof users>;

export const usersSelectSchema = createSelectSchema(users);
export const usersInsertSchema = createInsertSchema(users);
export const usersUpdateSchema = createUpdateSchema(users);
export const sessionsSelectSchema = createSelectSchema(sessions);
export const sessionsInsertSchema = createInsertSchema(sessions);
