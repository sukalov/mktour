import * as z from 'zod';

export const deleteClubFormSchema = z.object({
  name: z.string().min(1).max(100),
  id: z.string(),
});

export type DeleteClubFormType = z.infer<typeof deleteClubFormSchema>;
