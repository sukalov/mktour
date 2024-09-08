import * as z from 'zod';

export const deleteUserFormSchema = z.object({
  username: z.string().min(1).max(100),
  userId: z.string(),
});

export type DeleteUserFormType = z.infer<typeof deleteUserFormSchema>;