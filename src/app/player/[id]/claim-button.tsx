'use client';

import { LoadingSpinner } from '@/app/loading';
import CancelClaimPlayer from '@/app/player/[id]/cancel-claim-button';
import FormattedMessage, {
  IntlMessageId,
} from '@/components/formatted-message';
import useAffiliationRequestMutation from '@/components/hooks/mutation-hooks/use-affiliation-request';
import useUserClubAffiliations from '@/components/hooks/query-hooks/use-user-affiliations';
import { Button, ButtonProps } from '@/components/ui/button';
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
  const affiliation = userAffiliation?.[0];
  const { status, player_id } = affiliation || {};

  const hasClaimed =
    !!affiliation && status === 'requested' && player_id === playerId;

  if (hasClaimed)
    return (
      <CancelClaimPlayer
        userId={userId}
        clubId={clubId}
        affiliation={affiliation}
      />
    );

  if (!affiliation)
    return (
      <Root open={open} onOpenChange={setOpen}>
        <Trigger asChild>
          <ClaimActionButton
            disabled={isPending}
            icon={isPending ? LoadingSpinner : Pointer}
            messageId="Player.claim"
          />
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

export const ClaimActionButton: FC<ClaimActionButtonProps> = ({
  messageId,
  icon: Icon,
  disabled,
  ...props
}) => (
  <Button
    variant="ghost"
    size="sm"
    className="flex gap-2 text-nowrap"
    disabled={disabled}
    {...props}
  >
    <Icon />
    <span className="text-2xs">
      <FormattedMessage id={messageId} />
    </span>
  </Button>
);

type ClaimActionButtonProps = {
  messageId: IntlMessageId;
  icon: FC;
} & ButtonProps;

export default ClaimPlayer;
