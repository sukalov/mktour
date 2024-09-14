import { users } from '@/lib/db/schema/auth';
import { Format, Result, RoundName, TournamentType } from '@/types/tournaments';
import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import { int, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const players = sqliteTable('player', {
  id: text('id').primaryKey(),
  nickname: text('nickname').notNull(),
  realname: text('realname'),
  user_id: text('user_id').references(() => users.id),
  rating: int('rating'),
  club_id: text('club_id')
    .references(() => clubs.id)
    .notNull(), // TODO: add constraint on combination fo club_id and nickname
  last_seen: integer('last_seen'), // equals closed_at() last tournament they participated
});

export const tournaments = sqliteTable('tournament', {
  id: text('id').primaryKey(),
  title: text('name')
    .$default(() => 'chess tournament')
    .notNull(),
  format: text('format').$type<Format>().notNull(),
  type: text('type').$type<TournamentType>().notNull(),
  date: text('date').notNull(),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull(),
  club_id: text('club_id')
    .references(() => clubs.id)
    .notNull(),
  started_at: integer('started_at', { mode: 'timestamp' }),
  closed_at: integer('closed_at', { mode: 'timestamp' }),
  rounds_number: integer('rounds_number'), // necessary even if playing single elimination (final and match_for_third have same number);
  ongoing_round: integer('ongoing_round').$default(() => 1).notNull(),
  rated: integer('rated', { mode: 'boolean' }),
});

export const clubs = sqliteTable('club', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  created_at: integer('created_at', { mode: 'timestamp' }),
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

export const players_to_tournaments = sqliteTable('players_to_tournaments', {
  // join table where single tournament participants are stored
  id: text('id').primaryKey(),
  player_id: text('player_id')
    .notNull()
    .references(() => players.id),
  tournament_id: text('tournament_id')
    .notNull()
    .references(() => tournaments.id),
  wins: int('wins')
    .$default(() => 0)
    .notNull(),
  losses: int('losses')
    .$default(() => 0)
    .notNull(),
  draws: int('draws')
    .$default(() => 0)
    .notNull(),
  color_index: int('color_index')
    .$default(() => 0)
    .notNull(),
  place: int('place'),
  exited: int('exited', { mode: 'boolean' }),
});

export const games = sqliteTable('game', {
  id: text('id').primaryKey(),
  round_number: integer('round_number').notNull(),
  round_name: text('round_name').$type<RoundName>(),
  white_id: text('white_id')
    .references(() => players.id)
    .notNull(),
  black_id: text('black_id')
    .references(() => players.id)
    .notNull(),
  white_prev_game_id: text('white_prev_game_id'),
  black_prev_game_id: text('black_prev_game_id'),
  result: text('result').$type<Result>(),
  tournament_id: text('tournament_id')
    .references(() => tournaments.id)
    .notNull(),
});

export const clubs_relations = relations(clubs, ({ many }) => ({
  tournaments: many(tournaments),
  players: many(players),
}));

export const players_relations = relations(players, ({ one, many }) => ({
  club: one(clubs, { fields: [players.club_id], references: [clubs.id] }),
  tournaments: many(players_to_tournaments),
}));

export const tournaments_relations = relations(
  tournaments,
  ({ one, many }) => ({
    club: one(clubs, { fields: [tournaments.club_id], references: [clubs.id] }),
    players: many(players_to_tournaments),
  }),
);

export const players_to_tournaments_relations = relations(
  players_to_tournaments,
  ({ one }) => ({
    player: one(players, {
      fields: [players_to_tournaments.player_id],
      references: [players.id],
    }),
    tournament: one(tournaments, {
      fields: [players_to_tournaments.tournament_id],
      references: [tournaments.id],
    }),
  }),
);

export type DatabasePlayer = InferSelectModel<typeof players>;
export type DatabaseTournament = InferSelectModel<typeof tournaments>;
export type DatabaseClub = InferSelectModel<typeof clubs>;
export type DatabaseClubsToUsers = InferSelectModel<typeof clubs_to_users>;
export type DatabaseGame = InferSelectModel<typeof games>;
export type DatabasePlayerToTournament = InferSelectModel<
  typeof players_to_tournaments
>;
export type InsertDatabasePlayer = InferInsertModel<typeof players>;
export type InsertDatabaseTournament = InferInsertModel<typeof tournaments>;
export type InsertDatabaseClub = InferInsertModel<typeof clubs>;
export type InsertDatabaseClubsToUsers = InferInsertModel<
  typeof clubs_to_users
>;
export type InsertDatabaseGame = InferInsertModel<typeof games>;
export type InsertDatabasePlayerToTournament = InferInsertModel<
  typeof players_to_tournaments
>;
export type StatusInClub = 'admin' | 'moderator';
