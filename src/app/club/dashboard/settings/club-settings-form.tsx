'use client';

import useEditClubMutation from '@/components/hooks/mutation-hooks/use-club-edit';
import { useClubInfo } from '@/components/hooks/query-hooks/use-club-info';
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
import { shallowEqual } from '@/lib/utils';
import { EditClubFormType, editClubFormSchema } from '@/lib/zod/edit-club-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { User } from 'lucia';
import { Loader2, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';

export default function ClubSettingsForm({ user }: { user: User }) {
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
      <Card className="mx-auto max-w-[min(600px,98%)] border-none shadow-none sm:border-solid sm:shadow-sm">
        <CardContent className="p-4 sm:p-8">
          <form
            onSubmit={form.handleSubmit((data) =>
              clubSettingsMutation.mutate({ id: data.id, values: data }),
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
}
