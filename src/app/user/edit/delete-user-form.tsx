'use client';

import useDeleteUserMutation from '@/components/hooks/mutation-hooks/use-user-delete';
import { useUser } from '@/components/hooks/query-hooks/use-user';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { deleteUserFormSchema, DeleteUserFormType } from '@/lib/zod/delete-user-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2, Trash2 } from 'lucide-react';
import { useForm, useWatch } from 'react-hook-form';

export default function DeleteUserForm({
  className,
  userId,
}: DeleteProfileFormProps) {
  const queryClient = useQueryClient();
  const { data, isFetching } = useUser(userId);
  const userDeleteMutation = useDeleteUserMutation(queryClient);
  const form = useForm<DeleteUserFormType>({
    resolver: zodResolver(deleteUserFormSchema),
    values: { username: '', userId },
  });

  const watchedName = useWatch({
    control: form.control,
    name: 'username',
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(() =>
          userDeleteMutation.mutate({ userId }),
        )}
        className={cn('grid items-start gap-6 p-4 py-0', className)}
        name="delete-club-form"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>username</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={userDeleteMutation.isPending}
                  autoComplete="off"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField control={form.control} name="userId" render={() => <></>} />

        <Button
          disabled={
            data?.username !== watchedName ||
            !data ||
            userDeleteMutation.isPending ||
            isFetching
          }
          variant="destructive"
        >
          {userDeleteMutation.isPending ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Trash2 size={18} />
          )}
          &nbsp;delete club
        </Button>
      </form>
    </Form>
  );
};

interface DeleteProfileFormProps {
    className?: string;
    userId: string;
}
