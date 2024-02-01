import { Format, TournamentType } from '@/types/tournaments';
import * as z from 'zod';

export const newTournamentFormSchema = z.object({
  title: z
    .string({ required_error: 'naming is hard, but necessary' })
    .min(2, { message: 'naming is hard, but necessary' }),
  date: z.date().min(new Date(new Date().setDate(new Date().getDate() - 1)), {
    message: 'is it a time travel?',
  }),
  format: z.custom<Format>(),
  type: z.custom<TournamentType>(),
  timestamp: z.number(),
  team: z.string().optional(),
});

export type NewTournamentForm = z.infer<typeof newTournamentFormSchema>;
