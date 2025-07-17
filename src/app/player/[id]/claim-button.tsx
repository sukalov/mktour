'use client';

import { LoadingSpinner } from '@/app/loading';
import CancelClaimPlayer from '@/app/player/[id]/cancel-claim-button';
import FormattedMessage from '@/components/formatted-message';
import useAffiliationRequestMutation from '@/components/hooks/mutation-hooks/use-affiliation-request';
import useUserClubAffiliations from '@/components/hooks/query-hooks/use-user-affiliations';
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
import { Check, Pointer } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { FC, useState } from 'react';

const ClaimPlayer: FC<{
  userId: string;
  clubId: string;
}> = ({ userId, clubId }) => {
  const { id: playerId } = useParams<{ id: string }>();
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useAffiliationRequestMutation();
  const handleClick = () => {
    setOpen(false);
    mutate({ playerId, userId, clubId });
  };
  const t = useTranslations();

  const { data: userAffiliation } = useUserClubAffiliations(clubId);
  const { status, player_id } = userAffiliation || {};

  const hasClaimed =
    userAffiliation && status === 'requested' && player_id === playerId;

  if (hasClaimed)
    return (
      <CancelClaimPlayer
        userId={userId}
        clubId={clubId}
        affiliation={userAffiliation}
      />
    );

  if (!userAffiliation)
    return (
      <Root open={open} onOpenChange={setOpen}>
        <Trigger asChild>
          <Button
            variant="ghost"
            className="flex gap-2 px-2"
            disabled={isPending}
          >
            {isPending ? <LoadingSpinner /> : <Pointer />}
            <div className="text-[10px] text-nowrap">
              <FormattedMessage id="Player.claim" />
            </div>
          </Button>
        </Trigger>
        <Content>
          <Header>
            <Title>
              <FormattedMessage id="Player.claim" />
            </Title>
            <Description>
              <FormattedMessage id="Player.claim confirmation" />
            </Description>
          </Header>
          <Button
            className="w-full"
            onClick={handleClick}
            disabled={isPending}
            type="submit"
          >
            {isPending ? <LoadingSpinner /> : <Check />}
            &nbsp;
            {t('Common.send')}
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

export default ClaimPlayer;
