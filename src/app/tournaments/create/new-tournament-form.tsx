'use client';

import { turboPascal } from '@/app/fonts';
import { LoadingSpinner } from '@/app/loading';
import FormDatePicker from '@/app/tournaments/create/form-date-picker';
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
import { Label } from '@/components/ui/label';
import { RadioGroup } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import TypeCard from '@/components/ui/type-card';
import { createTournament } from '@/lib/actions/tournament-managing';
import { DatabaseClub } from '@/server/db/schema/clubs';
import { DatabaseUser } from '@/server/db/db/schema/users';
import {
  NewTournamentFormType,
  newTournamentFormSchema,
} from '@/lib/zod/new-tournament-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function NewTournamentForm({
  clubs,
  user,
}: NewTournamentFormProps) {
  const [defaultClub] = React.useState('');
  const form = useForm<NewTournamentFormType>({
    resolver: zodResolver(newTournamentFormSchema),
    defaultValues: {
      title: defaultClub,
      format: undefined,
      date: new Date(),
      timestamp: 0,
      type: 'solo',
      rated: false,
    },
  });
  const t = useTranslations('MakeTournament');

  const onSubmit = async (data: NewTournamentFormType) => {
    setSubmitButton(
      <Button disabled className="w-full">
        <LoadingSpinner />
        &nbsp;
        {t('making')}
      </Button>,
    );
    try {
      await createTournament({
        ...data,
        date: data.date.toISOString().slice(0, 10),
      });
    } catch (e) {
      if ((e as Error).message !== 'NEXT_REDIRECT') {
        console.log('SERVER_ERROR', e);
        toast.error(t('server error'));
      }
    }
  };

  const [submitButton, setSubmitButton] = React.useState(
    <Button type="submit" className="w-full">
      {t('make tournament')}
    </Button>,
  );

  return (
    <Form {...form}>
      <h2
        className={`m-2 text-center text-4xl font-bold ${turboPascal.className}`}
      >
        {t('new tournament')}
      </h2>
      <Card className="mx-auto max-w-[min(600px,98%)] border-none shadow-none sm:border-solid sm:shadow-2xs">
        <CardContent className="p-4 sm:p-8">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-8"
            name="new-tournament-form"
          >
            <FormField
              control={form.control}
              name="club_id"
              defaultValue={user.selected_club}
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent
                      ref={(ref) => {
                        if (!ref) return;
                        // ref.ontouchstart = (e) => e.preventDefault();
                      }}
                    >
                      <SelectGroup>
                        {clubs.map((club: DatabaseClub) => (
                          <SelectItem key={club.id} value={club.id}>
                            {club.name}
                          </SelectItem>
                        ))}
                        <SelectGroup>
                          <Link
                            href="/clubs/create"
                            className="m-0 box-border h-[30px] w-full p-0"
                          >
                            <Button
                              variant="ghost"
                              className="text-muted-foreground flex h-[30px] w-full flex-row justify-end gap-2 pl-7 font-extrabold"
                            >
                              <PlusIcon fontStyle="bold" /> {t('new club')}
                            </Button>
                          </Link>
                        </SelectGroup>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
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
            <FormField
              control={form.control}
              name="format"
              defaultValue="round robin"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="choose a format" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent
                      ref={(ref) => {
                        if (!ref) return;
                        // ref.ontouchstart = (e) => e.preventDefault();
                      }}
                    >
                      <SelectGroup>
                        <SelectItem value="round robin">
                          {t('round robin')}
                        </SelectItem>
                        <SelectItem value="swiss" disabled>
                          {t('swiss')}
                        </SelectItem>
                        <SelectItem value="single elimination" disabled>
                          {t('single elimination')}
                        </SelectItem>
                        <SelectItem value="double elimination" disabled>
                          {t('double elimination')}
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="grid grid-cols-3 gap-2 sm:gap-4"
                  >
                    <TypeCard name="solo" />
                    <TypeCard name="doubles" disabled />
                    <TypeCard name="team" disabled />
                  </RadioGroup>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => <FormDatePicker field={field} />}
            />
            <FormField
              control={form.control}
              name="rated"
              render={({ field }) => (
                <div className="flex items-center space-x-2">
                  <div className="peer flex items-center space-x-2">
                    <Label htmlFor="rated" className="text-muted-foreground">
                      {t('rated')}
                    </Label>
                    <Switch
                      id="rated"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled
                    />
                  </div>
                  <p className="text-muted-foreground hidden text-sm peer-hover:block">
                    <span className="text-xs">*</span>
                    {t('comming soon')}
                  </p>
                </div>
              )}
            />
            {submitButton}
          </form>
        </CardContent>
      </Card>
    </Form>
  );
}

interface NewTournamentFormProps {
  clubs: Array<DatabaseClub>;
  user: DatabaseUser;
}
