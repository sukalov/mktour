'use client';

import ClubManagersList from '@/app/clubs/my/(tabs)/settings/managers';
import { ClubTabProps } from '@/app/clubs/my/tabMap';
import { LoadingSpinner } from '@/app/loading';
import useEditClubMutation from '@/components/hooks/mutation-hooks/use-club-edit';
import { useClubInfo } from '@/components/hooks/query-hooks/use-club-info';
import SkeletonList from '@/components/skeleton-list';
import { Button } from '@/components/ui/button';
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
import { Save } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FC, PropsWithChildren } from 'react';
import { useForm } from 'react-hook-form';

const ClubSettingsForm: FC<ClubTabProps & PropsWithChildren> = ({
  selectedClub,
  userId,
  children,
}) => {
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
    values: data
      ? {
          name: data.name,
          description: data.description,
          lichess_team: data.lichess_team,
          id: selectedClub,
        }
      : undefined,
  });

  const t = useTranslations('Club.Settings');

  if (!data && isFetching) return <SkeletonList length={1} />;
  if (!data && children) return children;
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) =>
          clubSettingsMutation.mutate({
            clubId: data.id,
            userId,
            values: data,
          }),
        )}
        className="flex flex-col gap-2"
        name="edit-club-form"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="pl-4">{t('name')}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={isFetching}
                  autoComplete="off"
                  className="px-4"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField control={form.control} name="id" render={() => <></>} />
        <Button
          type="submit"
          disabled={
            shallowEqual(form.getValues(), defaultValues) ||
            clubSettingsMutation.isPending ||
            isFetching
          }
          className="w-full"
        >
          {clubSettingsMutation.isPending ? <LoadingSpinner /> : <Save />}
          &nbsp;{t('save')}
        </Button>
      </form>
      <ClubManagersList clubId={selectedClub} userId={userId} />
    </Form>
  );
};

export default ClubSettingsForm;
