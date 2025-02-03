'use client';

import { LoadingSpinner } from '@/app/loading';
import useDeletePlayerMutation from '@/components/hooks/mutation-hooks/use-player-delete';
import { Button } from '@/components/ui/button';
import {
  Close,
  Content,
  Description,
  Header,
  Root,
  Title,
  Trigger,
} from '@/components/ui/combo-modal';
import { useQueryClient } from '@tanstack/react-query';
import { CircleX } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { redirect } from 'next/navigation';
import { FC, useState } from 'react';

const DeletePlayer: FC<{ playerId: string; userId: string }> = ({
  playerId,
  userId,
}) => {
  const queryClient = useQueryClient();
  const { mutate, isPending, isSuccess } = useDeletePlayerMutation(queryClient);
  const handleClick = () => mutate({ playerId, userId });
  const [open, setOpen] = useState(false);
  const t = useTranslations();

  if (isSuccess) redirect('/clubs/my');

  return (
    <Root open={open} onOpenChange={setOpen}>
      <Trigger asChild>
        <Button
          disabled={isPending}
          className="flex gap-2 sm:w-fit"
          variant="destructive"
        >
          {isPending ? <LoadingSpinner /> : <CircleX />}
          {t('Player.delete')}
        </Button>
      </Trigger>
      <Content className="pb-4">
        <Header className="text-left">
          <Title>{t('Common.confirm')}</Title>
          <Description/>
        </Header>
        <div className="flex flex-col gap-4 px-4 md:p-0">
          <Button
            variant={'destructive'}
            className="w-full"
            onClick={handleClick}
            disabled={isPending}
          >
            {isPending ? <LoadingSpinner /> : <CircleX />}
            &nbsp;
            {t('Common.delete')}
          </Button>
          <Close asChild>
            <Button className="w-full" variant="outline">
              {t('Common.cancel')}
            </Button>
          </Close>
        </div>
      </Content>
    </Root>
  );
};

export default DeletePlayer;
