'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { deletePlayer } from '@/lib/actions/tournament-managing';
import { Button } from '@/components/ui/button';

const initialState = {
  message: '',
};

function DeleteButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      Delete
    </Button>
  );
}

export function DeleteForm({ id, name }: { id: string; name: string | null }) {
  const [state, formAction] = useFormState(deletePlayer, initialState);

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="name" value={String(name)} />
      <DeleteButton />
      <p aria-live="polite" className="sr-only" role="status">
        {state?.message}
      </p>
    </form>
  );
}
