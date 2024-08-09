import { validateNewPlayer } from '@/lib/zod/new-player-validation-action';
import * as z from 'zod';

export const newPlayerFormSchema = z
  .object({
    name: z.string().min(1, "what's his name?"),
    rating: z
      .number()
      .min(0, {
        message: 'min rating',
      })
      .max(3000, {
        message: 'max rating',
      })
      .default(1500),
    club_id: z.string(),
  })
  .refine(
    async (data) => {
      return await validateNewPlayer(data);
    },
    { message: 'this player already exists!', path: ['name'] },
  );

export type NewPlayerFormType = z.infer<typeof newPlayerFormSchema>;
