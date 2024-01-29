import { users } from '@/lib/db/schema/auth';
import { Format, Result, TournamentType } from '@/types/tournaments';
import { InferSelectModel } from 'drizzle-orm';
import { boolean } from 'drizzle-orm/mysql-core';
import { int, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const players = sqliteTable('player', {
  id: text('id').primaryKey(),
  nickname: text('nickname'),
  user_id: text('user_id').references(() => users.id),
  rating: int('rating'),
  org_id: text('org_id')
    .references(() => orgs.id)
    .notNull(), // todo add constraint on combination fo org_id and nickname
});

export const tournaments = sqliteTable('tournament', {
  id: text('id').primaryKey(),
  title: text('name').$default(() => 'tournament'),
  format: text('format').$type<Format>(),
  type: text('type').$type<TournamentType>(),
  date: text('date'),
  timestamp: integer('timestamp'),
  org_id: text('org_id').references(() => orgs.id),
  closed: integer('closed', { mode: 'boolean' }).$default(() => false),
});

export const orgs = sqliteTable('org', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  lichess_team: text('lichess_team'),
  is_default: integer('isDefault', { mode: 'boolean' }).$default(() => false),
});

export const orgs_to_users = sqliteTable('orgsto_users', {
  org_id: text('org_id')
    .notNull()
    .references(() => orgs.id),
  user_id: text('user_id')
    .notNull()
    .references(() => users.id),
  status: text('status').notNull().$type<StatusInOrg>(),
});

export const players_to_tournaments = sqliteTable('players_to_tournaments', {
  // join table where single tournament participants are stored
  player_id: text('player_id')
    .notNull()
    .references(() => players.id),
  tournament_id: text('tournament_id')
    .notNull()
    .references(() => tournaments.id),
  wins: int('wins').$default(() => 0),
  losses: int('losses').$default(() => 0),
  draws: int('draws').$default(() => 0),
  color_index: int('color_index').$default(() => 0),
  place: int('place'),
});

export const games = sqliteTable('game', {
  id: text('id').primaryKey(),
  round_number: integer(''),
  white_id: text('white_id').references(() => players.id),
  black_id: text('black_id').references(() => players.id),
  result: text('result').$type<Result>(),
  tournament_id: text('tournament_id').references(() => tournaments.id),
});

export type DatabasePlayer = InferSelectModel<typeof players>;
export type DatabaseTournament = InferSelectModel<typeof tournaments>;
export type DatabaseGame = InferSelectModel<typeof games>;
export type DatabasePlayerToTournament = InferSelectModel<
  typeof players_to_tournaments
>;
export type StatusInOrg = 'admin' | 'moderator';
