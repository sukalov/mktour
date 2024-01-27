'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { addPlayer } from '@/lib/actions/tournament-managing';
import { useFormState, useFormStatus } from 'react-dom';

const initialState = {
  message: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="mt-4 w-full" disabled={pending}>
      add
    </Button>
  );
}

export function AddPlayerForm() {
  const [state, formAction] = useFormState(addPlayer, initialState);

  return (
    <div className="w-64 pt-4">
      <form action={formAction}>
        <Label htmlFor="name">enter player name</Label>
        <Input type="text" id="name" name="name" required />
        <SubmitButton />
        <p aria-live="polite" className="sr-only" role="status">
          {state?.message}
        </p>
      </form>
    </div>
  );
}
