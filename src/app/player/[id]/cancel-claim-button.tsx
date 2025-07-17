'use client';

import { LoadingSpinner } from '@/app/loading';
import { ClaimActionButton } from '@/app/player/[id]/claim-button';
import FormattedMessage from '@/components/formatted-message';
import useAffiliationAbortRequestMutation from '@/components/hooks/mutation-hooks/use-affiliation-abort-request';
import { Button } from '@/components/ui/button';
import {
  Close,
  Content,
  Header,
  Root,
  Title,
  Trigger,
} from '@/components/ui/combo-modal';
import { DatabaseAffiliation } from '@/server/db/schema/players';
import { PointerOff } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FC, useState } from 'react';

const CancelClaimPlayer: FC<{
  userId: string;
  clubId: string;
  affiliation: DatabaseAffiliation;
}> = ({ userId, clubId, affiliation }) => {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useAffiliationAbortRequestMutation(clubId);
  const handleClick = () => {
    setOpen(false);
    mutate({
      affiliationId: affiliation.id,
      userId,
      playerId: affiliation.player_id,
    });
  };
  const t = useTranslations();

  return (
    <Root open={open} onOpenChange={setOpen}>
      <Trigger asChild>
        <ClaimActionButton
          disabled={isPending}
          icon={isPending ? LoadingSpinner : PointerOff}
          messageId="Player.cancel claim"
        />
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
