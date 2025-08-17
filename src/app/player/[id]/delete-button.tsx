'use client';

import { LoadingSpinner } from '@/app/loading';
import FormattedMessage from '@/components/formatted-message';
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
import { CircleX, Trash2Icon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { redirect, useParams } from 'next/navigation';
import { FC, useState } from 'react';

const DeletePlayer: FC<{ clubId: string; userId: string }> = ({
  clubId,
  userId,
}) => {
  const { id: playerId } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { mutate, isPending, isSuccess } = useDeletePlayerMutation(queryClient);
  const handleClick = () => mutate({ playerId, clubId, userId });
  const [open, setOpen] = useState(false);
  const t = useTranslations();

  if (isSuccess) redirect('/clubs/my');

  return (
    <Root open={open} onOpenChange={setOpen}>
      <Trigger asChild>
        <Button
          disabled={isPending}
          // size="sm"
          variant="destructive"
          className="gap-mk flex w-full"
        >
          {isPending ? <LoadingSpinner /> : <Trash2Icon />}
          <FormattedMessage id="Player.delete" />
        </Button>
      </Trigger>
      <Content>
        <Header>
          <Title>{t('Common.confirm')}</Title>
          <Description hidden />
        </Header>
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
      </Content>
    </Root>
  );
};

export default DeletePlayer;
