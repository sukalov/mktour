import { clubs } from '@/server/db/schema/clubs';
import { players_to_tournaments } from '@/server/db/schema/tournaments';
import { users } from '@/server/db/schema/users';
import { AffiliationStatus } from '@/server/db/zod/enums';
import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import {
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core';

export const players = sqliteTable(
  'player',
  {
    id: text('id').primaryKey(),
    nickname: text('nickname').notNull(),
    realname: text('realname'),
    userId: text('user_id').references(() => users.id),
    rating: integer('rating').notNull().default(1500),
    clubId: text('club_id')
      .references(() => clubs.id)
      .notNull(),
    lastSeen: integer('last_seen', { mode: 'timestamp' })
      .$default(() => new Date())
      .notNull(), // equals closed_at() last tournament they participated
  },
  (table) => [
    uniqueIndex('player_nickname_club_unique_idx').on(
      table.nickname,
      table.clubId,
    ),
    uniqueIndex('player_user_club_unique_idx').on(table.userId, table.clubId),
  ],
);

// user_id: the user of mktour used with lichess account who initiated the affiliation
// player_id: the actual player being affiliated
export const affiliations = sqliteTable(
  'affiliation',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    clubId: text('club_id')
      .references(() => clubs.id, { onDelete: 'cascade' })
      .notNull(),
    playerId: text('player_id')
      .references(() => players.id, { onDelete: 'cascade' })
      .notNull(),
    status: text('status').$type<AffiliationStatus>().notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .$default(() => new Date())
      .notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .$default(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex('affiliation_user_club_unique_idx').on(
      table.userId,
      table.clubId,
    ),
  ],
);

export const players_relations = relations(players, ({ one, many }) => ({
  club: one(clubs, { fields: [players.clubId], references: [clubs.id] }),
  tournaments: many(players_to_tournaments),
}));

export const affiliations_relations = relations(affiliations, ({ one }) => ({
  user: one(users, {
    fields: [affiliations.userId],
    references: [users.id],
  }),
  club: one(clubs, {
    fields: [affiliations.clubId],
    references: [clubs.id],
  }),
  player: one(players, {
    fields: [affiliations.playerId],
    references: [players.id],
  }),
}));

export type DatabasePlayer = InferSelectModel<typeof players>;
export type InsertDatabasePlayer = InferInsertModel<typeof players>;
export type DatabaseAffiliation = InferSelectModel<typeof affiliations>;
export type InsertDatabaseAffiliation = InferInsertModel<typeof affiliations>;
