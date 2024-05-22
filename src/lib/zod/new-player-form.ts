import { validateData } from '@/lib/zod/new-player-validation-action';
import * as z from 'zod';

export const newPlayerFormSchema = z
  .object({
    name: z.string().min(1, "what's his name?"),
    rating: z
      .number()
      .min(0, {
        message: 'negative rating??',
      })
      .max(3000, {
        message: 'no cheaters allowed',
      })
      .default(1500),
    club_id: z.string(),
  })
  .refine(async (data) => {
   return await validateData(data)
  }, {message: 'this player already exists!', "path": [ "name" ]});

export type NewPlayerFormType = z.infer<typeof newPlayerFormSchema>;
