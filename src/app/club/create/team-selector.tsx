'use client';

import { NewClubForm, TeamSlice } from '@/app/club/create/new-club-form';
import selectRef from '@/app/club/create/select-content-ref';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X } from 'lucide-react';
import { useState } from 'react';

export function TeamSelector({ teams, form }: TeamSelectorProps) {
  const [state, setState] = useState<boolean>(false);
  if ((teams.length === 0)) {
    return (
      <FormField
        control={form.control}
        name="lichess_team"
        render={({ field }) => (
          <FormItem>
            <Select onValueChange={field.onChange} defaultValue={field.value} disabled>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="couldn't find your lichess teams" />
                </SelectTrigger>
              </FormControl>
            </Select>
          </FormItem>
        )}
      />
    );
  }

  return (
    <FormField
      control={form.control}
      name="lichess_team"
      key={Number(state)}
      render={({ field }) => (
        <FormItem>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="connect lichess team!" />
              </SelectTrigger>
            </FormControl>
            <SelectContent ref={selectRef}>
              {teams.map((team) => (
                <SelectItem
                  key={team.value}
                  value={team.value}
                  className={`${form.getValues('lichess_team') && 'text-muted-foreground'}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  {team.label}
                </SelectItem>
              ))}
              {form.getValues('lichess_team') && (
                <Button
                  id="removeSelection"
                  className="h-[30px] w-full justify-start pl-8"
                  variant="ghost"
                  onClick={() => {
                    form.resetField('lichess_team');
                    setState(!state);
                  }}
                  style={{ pointerEvents: 'auto' }}
                >
                  <X className="pr-2" />
                  <span className="text-bold">don&apos;t link any team</span>
                </Button>
              )}
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
}

interface TeamSelectorProps {
  form: NewClubForm;
  teams: Array<TeamSlice>;
}
