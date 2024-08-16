'use client';

import useDeletePlayerMutation from '@/components/hooks/mutation-hooks/use-player-delete';
import { Button } from '@/components/ui/button';
import { useQueryClient } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';
import { FC } from 'react';

const DeletePlayer: FC<{ playerId: string }> = ({ playerId }) => {
  const queryClient = useQueryClient();
  // eslint-disable-next-line no-unused-vars
  const { mutate, isPending } = useDeletePlayerMutation(queryClient);

  return (
    <Button
      disabled={isPending}
      onClick={() => console.log(playerId)}
      size="icon"
    >
      <Trash2 />
    </Button>
  );
};

export default DeletePlayer;
