'use client';

import { LoadingSpinner } from '@/app/loading';
import useEditUserMutation from '@/components/hooks/mutation-hooks/use-user-edit';
import { useAuth } from '@/components/hooks/query-hooks/use-user';
import HalfCard from '@/components/ui-custom/half-card';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { shallowEqual } from '@/lib/utils';
import {
  editProfileFormSchema,
  EditProfileFormType,
} from '@/server/db/zod/users';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Save } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

export default function EditProfileForm() {
  const queryClient = useQueryClient();
  const userQuery = useAuth();
  const editUserMutation = useEditUserMutation(queryClient);

  const defaultValues = {
    name: userQuery.data?.name || undefined,
  };

  const form = useForm<EditProfileFormType>({
    resolver: zodResolver(editProfileFormSchema),
    values: defaultValues,
  });
  const t = useTranslations('EditUser');

  if (userQuery.isLoading) return <Skeleton className="m-4 w-full" />;

  return (
    <Form {...form}>
      <HalfCard className="w-full">
        <CardContent className="p-4 sm:p-8">
          <form
            onSubmit={form.handleSubmit((data) =>
              editUserMutation.mutate(data),
            )}
            className="flex flex-col gap-8"
            name="new-tournament-form"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('name')}</FormLabel>
                  <FormControl>
                    <Input {...field} autoComplete="off" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              disabled={
                shallowEqual(form.getValues(), defaultValues) ||
                editUserMutation.isPending ||
                userQuery.isFetching
              }
              type="submit"
              className="w-full"
            >
              {editUserMutation.isPending ? <LoadingSpinner /> : <Save />}
              &nbsp;{t('save')}
            </Button>
          </form>
        </CardContent>
      </HalfCard>
    </Form>
  );
}
