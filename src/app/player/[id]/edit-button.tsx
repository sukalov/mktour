'use client';

import EditPlayerForm from '@/app/player/[id]/player-form';
import FormattedMessage from '@/components/formatted-message';
import { Button } from '@/components/ui/button';
import {
  Content,
  Description,
  Header,
  Root,
  Title,
  Trigger,
} from '@/components/ui/combo-modal';
import { DatabasePlayer } from '@/lib/db/schema/players';
import { Pencil } from 'lucide-react';
import { FC } from 'react';

const ActionButton: FC<{ userId: string; player: DatabasePlayer }> = ({
  player,
  userId,
}) => {
  return (
    <Root>
      <Trigger asChild>
        <Button variant="ghost" size="icon" className="aspect-square">
          <Pencil />
        </Button>
      </Trigger>
      <Content>
        <Header>
          <Title className="pl-3">
            <FormattedMessage id="Common.edit" />
          </Title>
          <Description hidden />
        </Header>
        <EditPlayerForm {...{ player, userId }} />
      </Content>
    </Root>
  );
};

export default ActionButton;
