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
import { Skeleton } from '@/components/ui/skeleton';
import { editUser } from '@/lib/actions/profile-managing';
import { getUser } from '@/lib/auth/utils';
import { shallowEqual } from '@/lib/utils';
import {
  EditProfileFormType,
  editProfileFormSchema,
} from '@/lib/zod/edit-profile-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function EditProfileForm() {
  const queryClient = useQueryClient();
  const userQuery = useQuery({
    queryKey: ['user'],
    queryFn: () => getUser(),
    staleTime: 30 * 1000 * 60,
  });

  const defaultValues = {
    id: userQuery.data?.id ?? '',
    name: userQuery.data?.name ?? undefined,
  };

  const form = useForm<EditProfileFormType>({
    resolver: zodResolver(editProfileFormSchema),
    values: defaultValues,
  });

  const editUserMutation = useMutation({
    mutationFn: editUser,
    onSuccess: () => {
      toast.success('profile updated!');
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: () => toast.error('sorry! server error happened'),
  });

  if (userQuery.isLoading) return <Skeleton className="m-4 w-full" />;

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
                  <FormLabel>name</FormLabel>
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
                <Loader2 className="animate-spin" />
              ) : (
                <Save />
              )}
              &nbsp;save
            </Button>
          </form>
        </CardContent>
      </Card>
    </Form>
  );
}
