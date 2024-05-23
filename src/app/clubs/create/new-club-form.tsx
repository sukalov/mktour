'use client';

import ClubDescription from '@/app/clubs/create/description';
import { TeamSelector } from '@/app/clubs/create/team-selector';
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
import { Switch } from '@/components/ui/switch';
import { createClub } from '@/lib/actions/club-managing';
import { DatabaseUser } from '@/lib/db/schema/auth';
import { DatabaseClub } from '@/lib/db/schema/tournaments';
import { NewClubFormType, newClubFormSchema } from '@/lib/zod/new-club-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import * as React from 'react';
import { UseFormReturn, useForm } from 'react-hook-form';

export default function NewClubForm({ clubs, user, teams }: NewClubFormProps) {
  const form = useForm<NewClubFormType>({
    resolver: zodResolver(newClubFormSchema),
    defaultValues: {
      name: '',
      description: '',
      created_at: undefined,
    },
  });

    const onSubmit = (data: NewClubFormType) => {
      createClub({...data, created_at: new Date()});
      setSubmitButton(
        <Button disabled className="w-full">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          making...
        </Button>,
      );
    };

  const [submitButton, setSubmitButton] = React.useState(
    <Button type="submit" className="w-full">
      make new club
    </Button>,
  );

  return (
    <Form {...form}>
      <Card className="mx-auto max-w-[min(600px,98%)] border-none shadow-none sm:border-solid sm:shadow-sm">
        <CardContent className="p-8">
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
                  <FormLabel>name</FormLabel>
                  <FormControl>
                    <Input {...field} autoComplete="off" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <ClubDescription form={form} />
            <TeamSelector teams={teams} form={form} />
            <FormField
              control={form.control}
              name="set_default"
              render={({ field }) => (
                <div className="flex items-center space-x-2">
                  <Label htmlFor="set_default">set as your main club</Label>
                  <Switch
                    id="set_default"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
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

interface NewClubFormProps {
  clubs: Array<DatabaseClub>;
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
