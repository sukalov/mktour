'use client';

import * as React from 'react';
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { robotoMono, turboPascal } from '@/app/fonts';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { RadioGroup } from '@/components/ui/radio-group';
import TypeCard from '@/components/ui/type-card';
import FormDatePicker from '@/app/new-tournament/form-date-picker';
import { createTournament } from '@/lib/actions/tournament-managing';
import {
  type NewTournamentForm,
  newTournamentFormSchema,
} from '@/lib/zod/new-tournament-form';

export default function NewTournamentForm() {
  const form = useForm<NewTournamentForm>({
    resolver: zodResolver(newTournamentFormSchema),
    defaultValues: {
      title: '',
      format: undefined,
      date: new Date(),
      timestamp: 0,
      type: 'solo',
    },
  });

  const onSubmit = (data: NewTournamentForm) => {
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
        className={`mb-4 mt-4 text-center text-4xl font-bold ${turboPascal.className}`}
      >
        new tournament
      </h2>
      <Card className="mx-auto max-w-[min(600px,98%)] border-none shadow-none sm:border-solid sm:shadow-sm">
        <CardContent className="px-2 sm:px-16">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 pt-2 sm:pt-4"
            name="new-tournament-form"
          >
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
            {submitButton}
          </form>
        </CardContent>
      </Card>
    </Form>
  );
}
