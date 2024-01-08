'use client';

import * as React from 'react';
import * as z from 'zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { MdGroups, MdGroup, MdPerson } from 'react-icons/md';
import {
  Form,
  FormControl,
  FormDescription,
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
import TypeCard from '@/app/new-tournament/type-card';
import FormDatePicker from '@/app/new-tournament/form-date-picker';
import { createTournament } from '@/lib/actions';

const formSchema = z.object({
  tournament: z
    .string({ required_error: 'name the tournament' })
    .min(2, { message: 'name the tournament' }),
  date: z.date().min(new Date(new Date().toLocaleDateString()), {
    message: 'is it a time travel?',
  }),
  format: z
    .string({ required_error: 'format not selected' })
    .min(1, { message: 'format not selected' }),
  type: z.string(),
  timestamp: z.string(),
});

export type NewTournamentForm = z.infer<typeof formSchema>;

export default function NewTournamentForm() {
  const form = useForm<NewTournamentForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tournament: '',
      format: undefined,
      date: new Date(),
      timestamp: '',
      type: 'solo',
    },
  });

  const onSubmit = (data: NewTournamentForm) => createTournament(JSON.parse(JSON.stringify(data)))

  return (
    <Form {...form}>
      <h2
        className={`mb-4 mt-4 text-center text-4xl font-bold ${turboPascal.className}`}
      >
        {' '}
        new tournament
      </h2>
      <Card className="mx-auto max-w-[min(600px,98%)] border-none shadow-none sm:border-solid sm:shadow-sm">
        <CardContent className="px-2 sm:px-16">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 pt-2 sm:pt-4"
          >
            <FormField
              control={form.control}
              name="tournament"
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
                      <SelectItem value="swiss">swiss</SelectItem>
                      <SelectItem value="round robin">round robin</SelectItem>
                      <SelectItem value="single elimination">
                        single elimination
                      </SelectItem>
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
                    <TypeCard name="solo">
                      <MdPerson size={14} />
                    </TypeCard>
                    <TypeCard name="doubles">
                      <MdGroup size={16} />
                    </TypeCard>
                    <TypeCard name="team">
                      <MdGroups size={19} />
                    </TypeCard>
                  </RadioGroup>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => <FormDatePicker field={field} />}
            />
            <Button type="submit" className="w-full">
              make tournament
            </Button>
          </form>
        </CardContent>
      </Card>
    </Form>
  );
}
