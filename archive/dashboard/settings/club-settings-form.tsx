'use client';

import useEditClubMutation from '@/components/hooks/mutation-hooks/use-club-edit';
import { useClubInfo } from '@/components/hooks/query-hooks/use-club-info';
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
import { EditClubFormType, editClubFormSchema } from '@/lib/zod/edit-club-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { User } from 'lucia';
import { Loader2, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';

export default function ClubSettingsForm({ userId }: { userId: string }) {
  const user = useUser(userId);
  if (!user.data) return <Skeleton className="h-svh w-full p-4" />;
  return <ClubSettingsFormContent user={user.data} />;
}
const ClubSettingsFormContent = ({ user }: { user: User }) => {
  const queryClient = useQueryClient();
  const { data, isFetching } = useClubInfo(user.selected_club);
  const defaultValues = {
    name: data?.name,
    description: data?.description,
    lichess_team: data?.lichess_team,
    id: user.selected_club,
  };
  const clubSettingsMutation = useEditClubMutation(queryClient);
  const form = useForm<EditClubFormType>({
    resolver: zodResolver(editClubFormSchema),
    values: defaultValues,
  });
  return (
    <Form {...form}>
      <Card className="mx-auto max-w-[min(640px,100%)] border-none shadow-none sm:border-solid sm:shadow-sm">
        <CardContent className="p-2 sm:p-8">
          <form
            onSubmit={form.handleSubmit((data) =>
              clubSettingsMutation.mutate({ id: data.id, values: data, userId: user.id }),
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
                    <Input
                      {...field}
                      disabled={isFetching}
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField control={form.control} name="id" render={() => <></>} />

            <Button
              disabled={
                shallowEqual(form.getValues(), defaultValues) ||
                clubSettingsMutation.isPending ||
                isFetching
              }
              className="w-full"
            >
              {clubSettingsMutation.isPending ? (
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
};
