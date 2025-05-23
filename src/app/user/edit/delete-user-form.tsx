'use client';

import { LoadingSpinner } from '@/app/loading';
import useDeleteUserMutation from '@/components/hooks/mutation-hooks/use-user-delete';
import { useUser } from '@/components/hooks/query-hooks/use-user';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
  deleteUserFormSchema,
  DeleteUserFormType,
} from '@/lib/zod/delete-user-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

export default function DeleteUserForm({
  className,
  userId,
}: DeleteProfileFormProps) {
  const queryClient = useQueryClient();
  const { data, isFetching } = useUser();
  const { mutate, isPending } = useDeleteUserMutation(queryClient);
  const form = useForm<DeleteUserFormType>({
    resolver: zodResolver(deleteUserFormSchema),
    values: { username: '', userId, checkboxes: [] },
  });

  const watchedName = useWatch({
    control: form.control,
    name: 'username',
  });
  const watchedLength = useWatch({
    control: form.control,
    name: 'checkboxes',
  });

  const t = useTranslations('EditUser');
  const checkboxes: Array<keyof IntlMessages['EditUser']> = [
    'checkbox1',
    'checkbox2',
    'checkbox3',
  ];

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(() => mutate({ userId }))}
        className={cn('grid items-start gap-6 px-4 py-0 md:px-0', className)}
        name="delete-user-form"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  disabled={isPending}
                  autoComplete="off"
                  onPaste={(e) => {
                    e.preventDefault();
                    toast.error(t('do it yourself'), {
                      dismissible: true,
                      id: 'doItYourself',
                    });
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="checkboxes"
          render={() => (
            <FormItem>
              {checkboxes.map((checkbox) => (
                <FormField
                  key={checkbox}
                  control={form.control}
                  name="checkboxes"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={checkbox}
                        className="flex flex-row items-start space-y-0 space-x-3"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(checkbox)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, checkbox])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== checkbox,
                                    ),
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {t(checkbox)}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
            </FormItem>
          )}
        />
        <FormField control={form.control} name="userId" render={() => <></>} />

        <Button
          disabled={
            data?.username !== watchedName ||
            !data ||
            isPending ||
            isFetching ||
            watchedLength.length !== 3
          }
          variant="destructive"
        >
          {isPending ? <LoadingSpinner /> : <Trash2 />}
          &nbsp;{t('delete profile')}
        </Button>
      </form>
    </Form>
  );
}

interface DeleteProfileFormProps {
  className?: string;
  userId: string;
}
