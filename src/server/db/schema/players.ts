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
    user_id: text('user_id').references(() => users.id),
    rating: integer('rating').notNull(),
    club_id: text('club_id')
      .references(() => clubs.id)
      .notNull(),
    last_seen: integer('last_seen'), // equals closed_at() last tournament they participated
  },
  (table) => [
    uniqueIndex('player_nickname_club_unique_idx').on(
      table.nickname,
      table.club_id,
    ),
    uniqueIndex('player_user_club_unique_idx').on(table.user_id, table.club_id),
  ],
);

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

export const players_relations = relations(players, ({ one, many }) => ({
  club: one(clubs, { fields: [players.club_id], references: [clubs.id] }),
  tournaments: many(players_to_tournaments),
}));

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

export type DatabasePlayer = InferSelectModel<typeof players>;
export type InsertDatabasePlayer = InferInsertModel<typeof players>;
export type DatabaseAffiliation = InferSelectModel<typeof affiliations>;
export type InsertDatabaseAffiliation = InferInsertModel<typeof affiliations>;
