'use client';

import { LoadingSpinner } from '@/app/loading';
import FormattedMessage from '@/components/formatted-message';
import { Button } from '@/components/ui/button';
import {
  Close,
  Content,
  Header,
  Root,
  Title,
  Trigger,
} from '@/components/ui/combo-modal';
import { PointerOff } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { FC, useState } from 'react';

const CancelClaimPlayer: FC<{ userId: string; clubId: string }> = ({
  userId,
  clubId,
}) => {
  const { id: playerId } = useParams<{ id: string }>();
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const handleClick = () => {
    setOpen(false);
    setIsPending(true);
    setTimeout(() => {
      setIsPending(false);
    }, 2000);
    console.log('clicked', userId, clubId, playerId);
  };
  const t = useTranslations();

  return (
    <Root open={open} onOpenChange={setOpen}>
      <Trigger asChild>
        <Button variant="ghost" className="flex gap-2 p-2">
          {isPending ? (
            <LoadingSpinner />
          ) : (
            <>
              <PointerOff />
              <div className="text-[10px] text-nowrap">
                <FormattedMessage id="Player.cancel claim" />
              </div>
            </>
          )}
        </Button>
      </Trigger>
      <Content>
        <Header>
          <Title>
            <FormattedMessage id="Common.confirm" />
          </Title>
        </Header>
        <Button
          className="w-full"
          variant="destructive"
          onClick={handleClick}
          disabled={isPending}
          type="submit"
        >
          {isPending ? <LoadingSpinner /> : <PointerOff />}
          &nbsp;
          {t('Player.cancel claim')}
        </Button>
        <Close asChild>
          <Button className="w-full" variant="outline">
            {t('Common.close')}
          </Button>
        </Close>
      </Content>
    </Root>
  );
};

export default CancelClaimPlayer;
