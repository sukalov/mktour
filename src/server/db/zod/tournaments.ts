import {
  games,
  players_to_tournaments,
  tournaments,
} from '@/server/db/schema/tournaments';
import {
  tournamentFormatEnum,
  tournamentTypeEnum,
} from '@/server/db/zod/enums';
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';

export const tournamentsSelectSchema = createSelectSchema(tournaments, {
  format: tournamentFormatEnum,
  type: tournamentTypeEnum,
});
export const gamesSelectSchema = createSelectSchema(games);
export const playersToTournamentsSelectSchema = createSelectSchema(
  players_to_tournaments,
);
export const tournamentsInsertSchema = createInsertSchema(tournaments);
export const gamesInsertSchema = createInsertSchema(games);
export const playersToTournamentsInsertSchema = createInsertSchema(
  players_to_tournaments,
);
export const tournamentsUpdateSchema = createUpdateSchema(tournaments);
export const gamesUpdateSchema = createUpdateSchema(games);
export const playersToTournamentsUpdateSchema = createUpdateSchema(
  players_to_tournaments,
);
