import { validateNewPlayer } from '@/lib/zod/new-player-validation-action';
import { affiliations, players } from '@/server/db/schema/players';
import { players_to_tournaments } from '@/server/db/schema/tournaments';
import { affiliationStatusEnum } from '@/server/db/zod/enums';
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import z from 'zod';

export const playersSelectSchema = createSelectSchema(players);
export const playersInsertSchema = createInsertSchema(players, {
  rating: z
    .number()
    .min(0, {
      error: 'min rating',
    })
    .max(3000, {
      error: 'max rating',
    }),
});
export const playersUpdateSchema = createUpdateSchema(players);
export const affiliationsSelectSchema = createSelectSchema(affiliations, {
  status: affiliationStatusEnum,
});
export const affiliationsInsertSchema = createInsertSchema(affiliations);
export const affiliationsUpdateSchema = createUpdateSchema(affiliations);

export const affiliationExtendedSchema = affiliationsSelectSchema
  .extend({
    player: playersSelectSchema,
  })
  .omit({ playerId: true, clubId: true });

export const affiliationMinimalSchema = affiliationsSelectSchema.omit({
  playerId: true,
  clubId: true,
  userId: true,
});

export const playersMinimalSchema = playersSelectSchema.omit({
  clubId: true,
});

export const playerFormSchema = playersInsertSchema
  .omit({
    id: true,
    lastSeen: true,
    userId: true,
  })
  .refine(
    async (data) => {
      return await validateNewPlayer(data);
    },
    { error: 'player exists error', path: ['nickname'] },
  );

export const playersToTournamentsSelectSchema = createSelectSchema(
  players_to_tournaments,
);

export const playerTournamentSchema = playersToTournamentsSelectSchema
  .pick({
    pairingNumber: true,
    wins: true,
    draws: true,
    losses: true,
    colorIndex: true,
    isOut: true,
    place: true,
  })
  .extend({
    id: playersSelectSchema.shape.id,
    nickname: playersSelectSchema.shape.nickname,
    realname: playersSelectSchema.shape.realname,
    rating: playersSelectSchema.shape.rating,
  });

export type PlayerTournamentModel = z.infer<typeof playerTournamentSchema>;

export type AffiliationExtended = z.infer<typeof affiliationExtendedSchema>;
export type AffiliationMinimal = z.infer<typeof affiliationMinimalSchema>;
export type PlayerModel = z.infer<typeof playersSelectSchema>;
export type PlayerMinimalModel = z.infer<typeof playersMinimalSchema>;
export type PlayerFormModel = z.infer<typeof playerFormSchema>;
