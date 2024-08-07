import * as z from 'zod';

export const deleteClubFormSchema = z.object({
  name: z.string(),
  id: z.string(),
});

export type DeleteClubFormType = z.infer<typeof deleteClubFormSchema>;