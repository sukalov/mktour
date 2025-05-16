'use client';

import { LoadingSpinner } from '@/app/loading';
import FormattedMessage from '@/components/formatted-message';
import useAffiliationCancelByUserMutation from '@/components/hooks/mutation-hooks/use-affiliation-cancel';
import { Button } from '@/components/ui/button';
import {
  Close,
  Content,
  Header,
  Root,
  Title,
  Trigger,
} from '@/components/ui/combo-modal';
import { DatabaseAffiliation } from '@/lib/db/schema/players';
import { PointerOff } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FC, useState } from 'react';

const CancelClaimPlayer: FC<{
  userId: string;
  clubId: string;
  affiliation: DatabaseAffiliation;
}> = ({ userId, affiliation }) => {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useAffiliationCancelByUserMutation();
  const handleClick = () => {
    setOpen(false);
    mutate({ affiliationId: affiliation.id, userId });
  };
  const t = useTranslations();

  return (
    <Root open={open} onOpenChange={setOpen}>
      <Trigger asChild>
        <Button variant="ghost" className="flex gap-2 px-2">
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
