'use client';

import ClubDescription from '@/app/clubs/create/description';
import { TeamSelector } from '@/app/clubs/create/team-selector';
import { turboPascal } from '@/app/fonts';
import { LoadingSpinner } from '@/app/loading';
import { useClubCreate } from '@/components/hooks/query-hooks/use-club-create';
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
import { NewClubFormType, newClubFormSchema } from '@/lib/zod/new-club-form';
import { DatabaseUser } from '@/server/db/schema/users';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { UseFormReturn, useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function NewClubForm({ teams }: NewClubFormProps) {
  const form = useForm<NewClubFormType>({
    resolver: zodResolver(newClubFormSchema),
    defaultValues: {
      name: '',
      description: '',
      created_at: undefined,
      set_default: true,
    },
  });

  const t = useTranslations('NewClubForm');
  const { mutate, isPending: isMutating } = useClubCreate();
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const isPending = isMutating || isNavigating;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = form.getValues();
    mutate(
      {
        ...data,
        created_at: new Date(),
      },
      {
        onSuccess: () => {
          setIsNavigating(true);
          router.push('/clubs/my');
        },
        onError: (e) => {
          console.error(e);
          toast.error(t('club not created'));
        },
      },
    );
  };

  return (
    <Form {...form}>
      <h2
        className={`m-2 text-center text-4xl font-bold ${turboPascal.className}`}
      >
        {t('new club')}
      </h2>
      <Card className="bg-background sm:bg-card mx-auto max-w-[min(600px,98%)] border-none shadow-none sm:border-solid sm:shadow-2xs">
        <CardContent className="p-mk sm:p-mk-2 pt-2">
          <form
            onSubmit={handleSubmit}
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
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <LoadingSpinner />
                  &nbsp;
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

export type NewClubForm = UseFormReturn<{
  name: string;
  description?: string | undefined;
  created_at: Date;
  lichess_team?: string | undefined;
  set_default: boolean;
}>;
