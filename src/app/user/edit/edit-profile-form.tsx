'use client';

import useEditUserMutation from '@/components/hooks/mutation-hooks/use-user-edit';
import { useUser } from '@/components/hooks/query-hooks/use-user';
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
import { Skeleton } from '@/components/ui/skeleton';
import { shallowEqual } from '@/lib/utils';
import {
  EditProfileFormType,
  editProfileFormSchema,
} from '@/lib/zod/edit-profile-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Save } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

export default function EditProfileForm({ userId }: { userId: string }) {
  const queryClient = useQueryClient();
  const userQuery = useUser(userId);
  const editUserMutation = useEditUserMutation(queryClient);

  const defaultValues = {
    id: userQuery.data?.id ?? '',
    name: userQuery.data?.name ?? undefined,
  };

  const form = useForm<EditProfileFormType>({
    resolver: zodResolver(editProfileFormSchema),
    values: defaultValues,
  });
  const t = useTranslations('EditUser');

  if (userQuery.isLoading) return <Skeleton className="m-4 w-full" />;

  return (
    <Form {...form}>
      <Card className="w-full border-none shadow-none sm:border-solid sm:shadow-2xs">
        <CardContent className="p-4 sm:p-8">
          <form
            onSubmit={form.handleSubmit((data) =>
              editUserMutation.mutate({ id: data.id, values: data }),
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
            <FormField control={form.control} name="id" render={() => <></>} />

            <Button
              disabled={
                shallowEqual(form.getValues(), defaultValues) ||
                editUserMutation.isPending ||
                userQuery.isFetching
              }
              className="w-full"
            >
              {editUserMutation.isPending ? (
                <LoadingSpinner />
              ) : (
                <Save className="size-5" />
              )}
              &nbsp;{t('save')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Form>
  );
}
