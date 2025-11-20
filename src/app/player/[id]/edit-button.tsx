'use client';

import EditPlayerForm from '@/app/player/[id]/player-form';
import {
  Content,
  Description,
  Header,
  Root,
  Title,
  Trigger,
} from '@/components/ui-custom/combo-modal';
import { Button } from '@/components/ui/button';
import { DatabasePlayer } from '@/server/db/schema/players';
import { StatusInClub } from '@/server/db/zod/enums';
import { Pencil } from 'lucide-react';
import { FC, useState } from 'react';

const EditButton: FC<{
  userId: string;
  player: DatabasePlayer;
  status: StatusInClub | undefined;
}> = ({ userId, player, status }) => {
  const [open, setOpen] = useState(false);
  return (
    <Root open={open} onOpenChange={setOpen}>
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
          {...{ player, clubId: player.clubId, userId, status, setOpen }}
        />
      </Content>
    </Root>
  );
};

export default EditButton;
