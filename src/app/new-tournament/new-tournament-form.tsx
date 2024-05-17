'use client';

import { turboPascal } from '@/app/fonts';
import FormDatePicker from '@/app/new-tournament/form-date-picker';
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
import { DatabaseUser } from '@/lib/db/schema/auth';
import { DatabaseClub } from '@/lib/db/schema/tournaments';
import {
  NewTournamentFormType,
  newTournamentFormSchema,
} from '@/lib/zod/new-tournament-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, PlusIcon } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';
import { useForm } from 'react-hook-form';

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

  const onSubmit = (data: NewTournamentFormType) => {
    createTournament(JSON.parse(JSON.stringify(data)));
    setSubmitButton(
      <Button disabled className="w-full">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        making...
      </Button>,
    );
  };

  const [submitButton, setSubmitButton] = React.useState(
    <Button type="submit" className="w-full">
      make tournament
    </Button>,
  );

  return (
    <Form {...form}>
      <h2
        className={`m-4 text-center text-4xl font-bold ${turboPascal.className}`}
      >
        new tournament
      </h2>
      <Card className="mx-auto max-w-[min(600px,98%)] border-none shadow-none sm:border-solid sm:shadow-sm">
        <CardContent className="p-8">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-8"
            name="new-tournament-form"
          >
            <FormField
              control={form.control}
              name="club_id"
              defaultValue={user.default_club}
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
                    <SelectContent>
                      <SelectGroup>
                        {clubs.map((club: DatabaseClub) => (
                          <SelectItem key={club.id} value={club.id}>
                            {club.name}
                          </SelectItem>
                        ))}
                        <SelectGroup>
                          <div className="m-2 flex flex-row items-center justify-center">
                            <Link href="/new-club">
                              <Button
                                variant={'ghost'}
                                className="flex flex-row gap-2 font-extralight"
                              >
                                <PlusIcon /> new club
                              </Button>
                            </Link>
                          </div>
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
                  <FormLabel>name</FormLabel>
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
              defaultValue="swiss"
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
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="swiss">swiss</SelectItem>
                        <SelectItem value="round robin">round robin</SelectItem>
                        <SelectItem value="single elimination">
                          single elimination
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
                    <TypeCard name="doubles" />
                    <TypeCard name="team" />
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
                    <Label htmlFor="rated">rated</Label>
                    <Switch
                      id="rated"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled
                    />
                  </div>
                  <p className="hidden text-sm text-muted-foreground peer-hover:block">
                    <span className=" text-xs">*</span>comming soon
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
