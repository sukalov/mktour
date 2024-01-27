'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { addPlayer } from '@/lib/actions/tournament-managing';
import { RefObject, useEffect, useRef } from 'react';
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

export function AddPlayerForm({ tournamentId }: { tournamentId: string }) {
  const [state, formAction] = useFormState(addPlayer, initialState);
  const formRef: RefObject<HTMLFormElement> = useRef(null);

  useEffect(()=>{
    if (formRef.current) formRef.current.reset();
  }, [state])

  return (
    <div className="w-64 pt-4">
      <form
        action={formAction}
        id="addPlayer"
        ref={formRef}
      >
        <Label htmlFor="name">enter player name</Label>
        <Input type="text" id="name" name="name" required />
        <Input
          type="hidden"
          name="tournamentId"
          value={tournamentId}
        />
        <SubmitButton />
        <p aria-live="polite" className="sr-only" role="status">
          {state?.message}
        </p>
      </form>
    </div>
  );
}
