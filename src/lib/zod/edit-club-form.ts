import * as z from 'zod';

export const editClubFormSchema = z.object({
  name: z
    .string({ required_error: 'naming is hard, but necessary' })
    .min(3, { message: 'too short for a chess club name' })
    .optional(),
  description: z.string().optional().nullable(),
  lichess_team: z.string().optional().nullable(),
  id: z.string(),
});

export type EditClubFormType = z.infer<typeof editClubFormSchema>;
