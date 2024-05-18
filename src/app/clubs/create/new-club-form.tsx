'use client';

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
import { DatabaseClub } from '@/lib/db/schema/tournaments';
import { NewClubFormType, newClubFormSchema } from '@/lib/zod/new-club-form';
import { Team } from '@/types/lichess-api';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import * as React from 'react';
import { useForm } from 'react-hook-form';

export default function NewClubForm({ clubs, user }: NewTournamentFormProps) {
  const [teams, setTeams] = React.useState<Array<string>>([]);

  React.useEffect(() => {
    (async () => {
      const res = await fetch(
        `https://lichess.org/api/team/of/${user.username}`,
      );
      const teamsFull = await res.json() as Array<Team>;
      const teamsNames = teamsFull.map(el => el.name)
      setTeams(teamsNames);
    })();
  }, []);


  const form = useForm<NewClubFormType>({
    resolver: zodResolver(newClubFormSchema),
    defaultValues: {
      name: '',
      description: '',
      timestamp: 0,
      lichess_team: '',
    },
  });

  const onSubmit = (data: NewClubFormType) => {
    createClub(data);
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
      <h2
        className={`m-4 text-center text-4xl font-bold ${turboPascal.className}`}
      >
        new club
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
