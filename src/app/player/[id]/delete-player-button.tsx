'use client';

import { LoadingSpinner } from '@/app/loading';
import useDeletePlayerMutation from '@/components/hooks/mutation-hooks/use-player-delete';
import { Button } from '@/components/ui/button';
import { useQueryClient } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';
import { redirect } from 'next/navigation';
import { FC } from 'react';

const DeletePlayer: FC<{ playerId: string; userId: string }> = ({
  playerId,
  userId,
}) => {
  const queryClient = useQueryClient();
  const { mutate, isPending, isSuccess } = useDeletePlayerMutation(queryClient);
  const handleClick = () => mutate({ playerId, userId });

  if (isSuccess) redirect('/club/dashboard');

  return (
    <Button
      disabled={isPending}
      variant="ghost"
      className="text-destructive"
      onClick={handleClick}
      size="icon"
    >
      {isPending ? <LoadingSpinner /> : <Trash2 />}
    </Button>
  );
};

export default DeletePlayer;
