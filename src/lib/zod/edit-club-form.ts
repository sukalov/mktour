import * as z from 'zod';

export const editClubFormSchema = z.object({
  name: z
    .string({ required_error: 'hard naming' })
    .min(1, { message: 'hard naming' })
    .min(3, { message: 'short club name' })
    .optional(),
  description: z.string().optional().nullable(),
  lichess_team: z.string().optional().nullable(),
  id: z.string(),
});

export type EditClubFormType = z.infer<typeof editClubFormSchema>;
