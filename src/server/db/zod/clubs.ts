import { validateLichessTeam } from '@/lib/zod/new-club-validation-action';
import { clubs, clubs_to_users } from '@/server/db/schema/clubs';
import { statusInClubEnum } from '@/server/db/zod/enums';
import { usersSelectMinimalSchema } from '@/server/db/zod/users';
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
  lichessTeam: (s) =>
    s
      .superRefine(async (lichessTeam, ctx) => {
        if (!lichessTeam) return;
        const team = await validateLichessTeam({ lichessTeam });

        if (team) {
          ctx.addIssue({
            code: 'custom',
            message: `LINK_TEAM_ERROR@%!!(&${team.id}@%!!(&${team.name}`,
          });
        }
      })
      .optional(),
  description: z.string().nullish(),
}).omit({ id: true, createdAt: true });

export const clubsEditSchema = clubsInsertSchema.partial();

export const clubManagersSchema = z.object({
  user: usersSelectMinimalSchema,
  clubs_to_users: clubsToUsersSelectSchema,
});

export type ClubManager = z.infer<typeof clubManagersSchema>;
export type ClubEditType = z.infer<typeof clubsEditSchema>;
export type ClubFormType = z.infer<typeof clubsInsertSchema>;
