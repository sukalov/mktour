import { validateLichessTeam } from '@/lib/zod/new-club-validation-action';
import { clubs, clubs_to_users } from '@/server/db/schema/clubs';
import { statusInClubEnum } from '@/server/db/zod/enums';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import z from 'zod';

export const clubsSelectSchema = createSelectSchema(clubs);
export const clubsToUsersSelectSchema = createSelectSchema(clubs_to_users, {
  status: statusInClubEnum,
});

export const clubsInsertSchema = createInsertSchema(clubs, {
  name: (s) =>
    s
      .min(3, { error: 'short club name' })
      .max(100, { error: 'long club name' }),
  lichess_team: (s) =>
    s
      .superRefine(async (lichess_team, ctx) => {
        if (!lichess_team) return;
        const team = await validateLichessTeam({ lichess_team });

        if (team) {
          ctx.addIssue({
            code: 'custom',
            message: `LINK_TEAM_ERROR@%!!(&${team.id}@%!!(&${team.name}`,
          });
        }
      })
      .optional(),
  description: z.string().optional(),
}).omit({ id: true, created_at: true });

export type ClubFormType = z.infer<typeof clubsInsertSchema>;
