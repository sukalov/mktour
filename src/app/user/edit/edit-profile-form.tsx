'use client';

import { turboPascal } from '@/app/fonts';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { editUser } from '@/lib/actions/profile-managing';
import { shallowEqual } from '@/lib/utils';
import {
    EditProfileFormType,
    editProfileFormSchema,
} from '@/lib/zod/edit-profile-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User } from 'lucia';
import { Loader2, Save } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function EditProfileForm({ user }: EditProfileformProps) {
  const [defaultValues, setDefaultValues] = useState<EditProfileFormType>({
    name: user.name ?? undefined,
  });

  const form = useForm<EditProfileFormType>({
    resolver: zodResolver(editProfileFormSchema),
    defaultValues,
  });

  const isChanged = () => {
    if (shallowEqual(form.getValues(), defaultValues)) {
      setSubmitButton(
        <Button disabled className="w-full">
          <Save />
          &nbsp;save
        </Button>,
      );
    } else {
      setSubmitButton(
        <Button type="submit" className="w-full">
          <Save />
          &nbsp;save
        </Button>,
      );
    }
  };

  const [submitButton, setSubmitButton] = useState(
    <Button disabled className="w-full">
      <Save />
      &nbsp;save
    </Button>,
  );

  const onSubmit = async (data: EditProfileFormType) => {
    setSubmitButton(
      <Button disabled className="w-full">
        <Loader2 className="mr-2 animate-spin" />
        save
      </Button>,
    );
    try {
      await editUser(data);
      setDefaultValues(data)
      setSubmitButton(
        <Button disabled className="w-full">
          <Save />
          &nbsp;save
        </Button>,
      );
      toast.success('changes saved!');
    } catch (e) {
      setSubmitButton(
        <Button type="submit" className="w-full">
          save
        </Button>,
      );
      toast.error('sorry! server error happened, changes not saved');
    }
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
                    <Input {...field} autoComplete="off" onKeyUp={isChanged} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {submitButton}
          </form>
        </CardContent>
      </Card>
    </Form>
  );
}

interface EditProfileformProps {
  user: User;
}
