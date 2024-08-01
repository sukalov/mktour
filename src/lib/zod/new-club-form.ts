import { validateLichessTeam } from '@/lib/zod/new-club-validation-action';
import * as z from 'zod';

export const newClubFormSchema = z
  .object({
    name: z
      .string({ required_error: 'naming is hard, but necessary' })
      .min(3, { message: 'too short for a chess club name' }),
    description: z.string().optional(),
    created_at: z.date().optional(),
    lichess_team: z.string().optional(),
  })
  .refine(
    async (data) => {
      return await validateLichessTeam(data);
    },
    { message: 'this team already has mktour club!', path: ['lichess_team'] },
  );

export type NewClubFormType = z.infer<typeof newClubFormSchema>;
