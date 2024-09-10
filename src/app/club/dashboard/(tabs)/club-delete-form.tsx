'use client';

import useDeleteClubMutation from '@/components/hooks/mutation-hooks/use-club-delete';
import { useClubInfo } from '@/components/hooks/query-hooks/use-club-info';
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
import {
  deleteClubFormSchema,
  DeleteClubFormType,
} from '@/lib/zod/delete-club-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2, Trash2 } from 'lucide-react';
import { useForm, useWatch } from 'react-hook-form';

export default function DeleteConfirmationForm({
  className,
  id,
  userId,
}: DeleteConfirmationFormProps) {
  const queryClient = useQueryClient();
  const { data, isFetching } = useClubInfo(id);
  const clubDeleteMutation = useDeleteClubMutation(queryClient);
  const form = useForm<DeleteClubFormType>({
    resolver: zodResolver(deleteClubFormSchema),
    values: { name: '', id },
  });

  const watchedName = useWatch({
    control: form.control,
    name: 'name',
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) =>
          clubDeleteMutation.mutate({ id: data.id, userId, values: data }),
        )}
        className={cn('grid items-start gap-6 px-4 py-0 md:px-0', className)}
        name="delete-club-form"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={clubDeleteMutation.isPending}
                  autoComplete="off"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField control={form.control} name="id" render={() => <></>} />

        <Button
          disabled={
            data?.name !== watchedName ||
            !data ||
            clubDeleteMutation.isPending ||
            isFetching
          }
          variant="destructive"
        >
          {clubDeleteMutation.isPending ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Trash2 size={18} />
          )}
          &nbsp;delete club
        </Button>
      </form>
    </Form>
  );
}

export interface DeleteConfirmationFormProps {
  className?: string;
  id: string;
  userId: string;
}
