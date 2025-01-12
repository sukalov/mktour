'use client';

import ClubDescription from '@/app/clubs/create/description';
import { TeamSelector } from '@/app/clubs/create/team-selector';
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
import { createClub } from '@/lib/actions/club-managing';
import { DatabaseUser } from '@/lib/db/schema/auth';
import { NewClubFormType, newClubFormSchema } from '@/lib/zod/new-club-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import * as React from 'react';
import { UseFormReturn, useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function NewClubForm({ teams }: NewClubFormProps) {
  const form = useForm<NewClubFormType>({
    resolver: zodResolver(newClubFormSchema),
    defaultValues: {
      name: '',
      description: '',
      created_at: undefined,
    },
  });

  const t = useTranslations('NewClubForm');

  const onSubmit = async (data: NewClubFormType) => {
    setIsSubmitting(true);

    try {
      await createClub({ ...data, created_at: new Date() });
    } catch {
      toast.error(t('club not saved'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  return (
    <Form {...form}>
      <h2
        className={`m-2 text-center text-4xl font-bold ${turboPascal.className}`}
      >
        {t('new club')}
      </h2>
      <Card className="mx-auto max-w-[min(600px,98%)] border-none shadow-none sm:border-solid sm:shadow-2xs">
        <CardContent className="p-4 pt-2 sm:p-8">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
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
            <ClubDescription form={form} />
            <TeamSelector teams={teams} form={form} />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('making')}
                </>
              ) : (
                t('make new club')
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Form>
  );
}

interface NewClubFormProps {
  user: DatabaseUser;
  teams: TeamSlice[];
}

export interface TeamSlice {
  label: string;
  value: string;
}

export type NewClubForm = UseFormReturn<
  {
    name: string;
    description?: string | undefined;
    created_at?: Date | undefined;
    lichess_team?: string | undefined;
    set_default?: boolean | undefined;
  },
  any,
  undefined
>;
