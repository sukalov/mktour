import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { FormControl, FormItem, FormMessage } from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { NewTournamentFormType } from '@/lib/zod/new-tournament-form';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { ControllerRenderProps } from 'react-hook-form';

interface FormDatePickerProps {
  field: ControllerRenderProps<NewTournamentFormType, 'date'>;
}

export default function FormDatePicker({ field }: FormDatePickerProps) {
  return (
    <>
      <FormItem>
        <FormControl>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !field.value && 'text-muted-foreground',
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {field.value ? (
                  format(field.value, 'PPP')
                ) : (
                  <span>pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                required
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </FormControl>
        <FormMessage />
      </FormItem>
    </>
  );
}
