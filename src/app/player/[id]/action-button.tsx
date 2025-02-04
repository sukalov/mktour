'use client';

import DeletePlayer from '@/app/player/[id]/delete-player-button';
import { Button } from '@/components/ui/button';
import {
  Content,
  Description,
  Header,
  Root,
  Title,
  Trigger,
} from '@/components/ui/combo-modal';
import { Pencil } from 'lucide-react';
import { FC } from 'react';

const ActionButton: FC<{ userId: string }> = ({ userId }) => {
  return (
    <Root>
      <Trigger asChild>
        <Button variant="outline" size="icon" className="aspect-square">
          <Pencil />
        </Button>
      </Trigger>
      <Content className="flex flex-col gap-4 p-4 md:p-6">
        <Header className="p-0 text-left">
          <Title className="mb-0">edit</Title>
          <Description hidden />
        </Header>
        <DeletePlayer userId={userId} />
      </Content>
    </Root>
  );
};

export default ActionButton;
