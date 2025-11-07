'use client';

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
import { StatusInClub } from '@/server/db/schema/clubs';
import { DatabasePlayer } from '@/server/db/schema/players';
import { Pencil } from 'lucide-react';
import { FC } from 'react';

const EditButton: FC<{
  userId: string;
  player: DatabasePlayer;
  status: StatusInClub | undefined;
}> = ({ userId, player, status }) => {
  return (
    <Root>
      <Trigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Pencil />
        </Button>
      </Trigger>
      <Content>
        <Header>
          <Title className="pl-3">
            {/* <FormattedMessage id="Common.edit" /> */}
          </Title>
          <Description hidden />
        </Header>
        <EditPlayerForm
          {...{ player, clubId: player.club_id, userId, status }}
        />
      </Content>
    </Root>
  );
};

export default EditButton;
