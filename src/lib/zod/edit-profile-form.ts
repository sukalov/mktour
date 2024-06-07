import * as z from 'zod';

export const editProfileFormSchema = z.object({
  name: z
    .string({ required_error: 'naming is hard, but necessary' })
    .min(3, { message: 'too short for a chess club name' })
    .optional(),
  id: z.string()
});

export type EditProfileFormType = z.infer<typeof editProfileFormSchema>;
