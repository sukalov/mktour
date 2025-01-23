'use client';

import { ClubTabProps } from '@/app/clubs/my/dashboard';
import useEditClubMutation from '@/components/hooks/mutation-hooks/use-club-edit';
import { useClubInfo } from '@/components/hooks/query-hooks/use-club-info';
import SkeletonList from '@/components/skeleton-list';
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
import { Loader2, Save } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FC } from 'react';
import { useForm } from 'react-hook-form';

const ClubSettingsForm: FC<ClubTabProps> = ({ selectedClub, userId }) => {
  const queryClient = useQueryClient();
  const { data, isFetching } = useClubInfo(selectedClub);
  const defaultValues = {
    name: data?.name,
    description: data?.description,
    lichess_team: data?.lichess_team,
    id: selectedClub,
  };
  const clubSettingsMutation = useEditClubMutation(queryClient);

  const form = useForm<EditClubFormType>({
    resolver: zodResolver(editClubFormSchema),
    defaultValues: {
      name: '',
      description: '',
      lichess_team: '',
      id: selectedClub,
    },
    values: data ? {
      name: data.name,
      description: data.description,
      lichess_team: data.lichess_team,
      id: selectedClub,
    } : undefined,
  });

  const t = useTranslations('Club.Settings');

  if (!data && isFetching) return <SkeletonList length={1} />;
  return (
    <Form {...form}>
      <Card className="border-none shadow-none sm:border-solid sm:shadow-2xs">
        <CardContent className="sm:py-8">
          <form
            onSubmit={form.handleSubmit((data) =>
              clubSettingsMutation.mutate({
                id: data.id,
                userId,
                values: data,
              }),
            )}
            className="flex flex-col gap-8"
            name="edit-club-form"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('name')}</FormLabel>
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
              &nbsp;{t('save')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Form>
  );
};

export default ClubSettingsForm;
