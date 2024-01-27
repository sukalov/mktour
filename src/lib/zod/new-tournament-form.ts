import { Format } from '@/types/tournaments';
import * as z from 'zod';

export const newTournamentFormSchema = z.object({
  title: z
    .string({ required_error: 'name the tournament' })
    .min(2, { message: 'name the tournament' }),
  date: z.date().min(new Date(new Date().setDate(new Date().getDate() - 1)), {
    message: 'is it a time travel?',
  }),
  format: z.custom<Format>(),
  type: z.string(),
  timestamp: z.string(),
  user: z.string().optional(),
});

export type NewTournamentForm = z.infer<typeof newTournamentFormSchema>;
