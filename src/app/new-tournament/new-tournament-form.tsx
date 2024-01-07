'use client'

import * as React from 'react'
import * as z from 'zod'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { MdGroups, MdGroup, MdPerson } from "react-icons/md";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { turboPascal } from '@/app/fonts'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { RadioGroup } from '@/components/ui/radio-group'
import TypeCard from '@/app/new-tournament/type-card'

const formSchema = z.object({
	tournament: z.string({ required_error: 'name the tournament' }).min(2, { message: 'name the tournament' }),
	date: z
		.date()
		.min(new Date(new Date().toLocaleDateString()), { message: 'is it a time travel?' }),
	format: z.string({ required_error: 'format not selected' }).min(1, {message: 'format not selected'}),
  type: z.string(),
  timestamp: z.string(),
})

export default function NewTournamentForm() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: { 
      tournament: '',
      format: undefined,
			date: new Date(),
      timestamp: '',
      type: 'solo'
		},
	})

	function onSubmit(values: z.infer<typeof formSchema>) {
    values.timestamp = new Date().toISOString(),
    console.log(values)
	}
	return (
    <Form {...form}>
      <h2 className={`text-4xl font-semibold mt-4 mb-4 text-center ${turboPascal.className}`} > new tournament</h2>
      <Card className='max-w-[min(600px,98%)] mx-auto mt-2'>
        <CardContent>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 pt-4'>
				<FormField
					control={form.control}
					name='tournament'
					render={({ field }) => (
						<FormItem>
							<FormLabel>name</FormLabel>
							<FormControl>
								<Input {...field} />
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="choose a format" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="swiss">swiss</SelectItem>
                  <SelectItem value="round robin">round robin</SelectItem>
                  <SelectItem value="single elimination">single elimination</SelectItem>
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
        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-3 sm:gap-4 gap-2">
          <TypeCard name='solo'><MdPerson size={14}/></TypeCard>
          <TypeCard name='doubles'><MdGroup size={16}/></TypeCard>
          <TypeCard name='team'><MdGroups size={19}/></TypeCard>
        </RadioGroup>
        </FormItem>
          )}
        />
				<FormField
					control={form.control}
					name='date'
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Popover>
									<PopoverTrigger asChild>
										<Button
											variant={'outline'}
											className={cn(
												'w-full justify-start text-left font-normal',
												!field.value && 'text-muted-foreground'
											)}
										>
											<CalendarIcon className='mr-2 h-4 w-4' />
											{field.value ? format(field.value, 'PPP') : <span>pick a date</span>}
										</Button>
									</PopoverTrigger>
									<PopoverContent className='w-auto p-0'>
										<Calendar
                      required
											mode='single'
											selected={field.value}
											onSelect={field.onChange}
											initialFocus
										/>
									</PopoverContent>
								</Popover>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type='submit' className='w-full'>
					make tournament
				</Button>
			</form>
      </CardContent></Card>
		</Form>
	)
}
