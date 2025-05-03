import { validateNewPlayer } from '@/lib/zod/new-player-validation-action';
import * as z from 'zod';

export const newPlayerFormSchema = z
  .object({
    name: z.string().min(1, 'name'),
    rating: z
      .number()
      .min(0, {
        message: 'min rating',
      })
      .max(3000, {
        message: 'max rating',
      }),
    club_id: z.string(),
  })
  .refine(
    async (data) => {
      return await validateNewPlayer(data);
    },
    { message: 'player exists error', path: ['name'] },
  );

export type NewPlayerFormType = z.infer<typeof newPlayerFormSchema>;
