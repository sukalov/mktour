import * as z from 'zod';

export const editClubFormSchema = z.object({
  name: z
    .string({ error: 'hard naming' })
    .min(1, { error: 'hard naming' })
    .min(3, { error: 'short club name' })
    .optional(),
  description: z.string().optional().nullable(),
  lichessTeam: z.string().optional().nullable(),
  id: z.string(),
});

export type EditClubFormType = z.infer<typeof editClubFormSchema>;
