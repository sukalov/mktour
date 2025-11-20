import * as z from 'zod';

const editProfileFormSchema = z.object({
  name: z.string().optional(),
  id: z.string(),
});

type EditProfileFormType = z.infer<typeof editProfileFormSchema>;
