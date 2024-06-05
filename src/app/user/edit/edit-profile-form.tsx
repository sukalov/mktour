'use client';

import { turboPascal } from '@/app/fonts';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { EditProfileFormType, editProfileFormSchema } from '@/lib/zod/edit-profile-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User } from 'lucia';
import { useForm } from 'react-hook-form';

export default function EditProfileForm({ user }: EditProfileformProps) {
  const form = useForm<EditProfileFormType>({
    resolver: zodResolver(editProfileFormSchema),
    defaultValues: {
      name: user.name ?? undefined,
    },
  });

  const onSubmit = () => {
    console.log('f');
  };
  return (
    <Form {...form}>
      <h2
        className={`m-2 text-center text-4xl font-bold ${turboPascal.className}`}
      >
        settings
      </h2>
      <Card className="mx-auto max-w-[min(600px,98%)] border-none shadow-none sm:border-solid sm:shadow-sm">
        <CardContent className="p-4 sm:p-8">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-8"
            name="new-tournament-form"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>name</FormLabel>
                  <FormControl>
                    <Input {...field} autoComplete="off" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </CardContent>
      </Card>
    </Form>
  );
}

interface EditProfileformProps {
    user: User;
}
