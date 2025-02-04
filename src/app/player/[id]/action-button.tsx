'use client';

import DeletePlayer from '@/app/player/[id]/delete-player-button';
import EditPlayerForm from '@/app/player/[id]/player-form';
import { Button } from '@/components/ui/button';
import {
  Content,
  Description,
  Header,
  Root,
  Title,
  Trigger,
} from '@/components/ui/combo-modal';
import { DatabasePlayer } from '@/lib/db/schema/tournaments';
import { Pencil } from 'lucide-react';
import { FC } from 'react';

const ActionButton: FC<{ userId: string; player: DatabasePlayer }> = ({
  userId,
  player,
}) => {
  return (
    <Root>
      <Trigger asChild>
        <Button variant="outline" size="icon" className="aspect-square">
          <Pencil />
        </Button>
      </Trigger>
      <Content>
        <Header>
          <Title>edit</Title>
          <Description hidden />
        </Header>
        <EditPlayerForm {...player}/>
        <DeletePlayer userId={userId} />
      </Content>
    </Root>
  );
};

export default ActionButton;
