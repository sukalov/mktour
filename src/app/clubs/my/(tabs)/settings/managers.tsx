'use client';

import AddManagerDrawer from '@/app/clubs/my/(tabs)/settings/add-manager-drawer';
import { LoadingSpinner } from '@/app/loading';
import FormattedMessage from '@/components/formatted-message';
import useDeleteClubManagerMutation from '@/components/hooks/mutation-hooks/use-club-delete-manager';
import { useClubManagers } from '@/components/hooks/query-hooks/use-club-managers';
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
import { Skeleton } from '@/components/ui/skeleton';
import { ClubManager } from '@/server/mutations/club-managing';
import { Trash2, User2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Dispatch, FC, SetStateAction, useState } from 'react';
import { toast } from 'sonner';

const ClubManagersList: FC<{ clubId: string; userId: string }> = ({
  clubId,
  userId,
}) => {
  const { data, status } = useClubManagers(clubId);
  const t = useTranslations('Club.Settings');
  const user = data?.find(
    ({ clubs_to_users: { user_id } }) => user_id === userId,
  );

  if (status === 'error') toast.error(t('search users error'));

  return (
    <div className="flex flex-col gap-2">
      <div className="pl-4 text-sm">
        <FormattedMessage id="Club.managers list" />
      </div>
      <div>
        {status !== 'success' ? (
          <Skeleton className="h-12 w-full" />
        ) : (
          <ul className="list-disc pl-4 text-sm">
            {data.map((manager) => (
              <ManagersIteratee
                key={manager.user.id}
                manager={manager}
                user={user}
              />
            ))}
          </ul>
        )}
      </div>
      <AddManagerDrawer clubId={clubId} userId={userId} />
    </div>
  );
};

const ManagersIteratee = ({
  manager,
  user,
}: {
  manager: ClubManager;
  user: ClubManager | undefined;
}) => (
  <li className="not-last:pb-2">
    <ManagerItem manager={manager} user={user} />
  </li>
);

const ManagerItem: FC<{
  manager: ClubManager;
  user: ClubManager | undefined;
}> = ({ manager, user }) => {
  const t = useTranslations('Status');
  const [open, setOpen] = useState(false);

  const canDelete =
    user &&
    user.clubs_to_users.status === 'co-owner' &&
    manager.clubs_to_users.status === 'admin';

  return (
    <Root key={manager.user.id} open={open} onOpenChange={setOpen}>
      <Trigger type="button">
        {manager.user.username}
        &nbsp;
        <span className="text-muted-foreground">
          {t(manager.clubs_to_users.status)}
        </span>
      </Trigger>
      <Content>
        <Header>
          <Title>{manager.user.username}</Title>
          <Description>{t(manager.clubs_to_users.status)}</Description>
        </Header>
        <Button>
          <Link href={`/user/${manager.user.username}`} className="flex gap-2">
            <User2 />
            <FormattedMessage id="Tournament.Table.Player.profile" />
          </Link>
        </Button>
        {canDelete && (
          <DeleteManagerButton
            clubId={user.clubs_to_users.club_id}
            userId={manager.user.id}
            setOpen={setOpen}
          />
        )}
        <Close asChild>
          <Button className="w-full" variant="outline">
            <FormattedMessage id="Common.close" />
          </Button>
        </Close>
      </Content>
    </Root>
  );
};

const DeleteManagerButton: FC<{
  clubId: string;
  userId: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
}> = ({ clubId, userId, setOpen }) => {
  const { mutate, isPending } = useDeleteClubManagerMutation();
  return (
    <Root>
      <Trigger asChild>
        <Button variant="destructive" className="flex gap-2">
          <Trash2 />
          <FormattedMessage id="Club.Settings.delete manager" />
        </Button>
      </Trigger>
      <Content>
        <Header>
          <Title>
            <FormattedMessage id="Common.confirm" />
          </Title>
        </Header>
        <Button
          variant="destructive"
          className="flex gap-2"
          onClick={() => {
            mutate({ clubId, userId });
            setOpen(false);
          }}
          disabled={isPending}
        >
          {isPending ? <LoadingSpinner /> : <Trash2 />}
          <FormattedMessage id="Common.delete" />
        </Button>
        <Close asChild>
          <Button variant="outline">
            <FormattedMessage id="Common.cancel" />
          </Button>
        </Close>
      </Content>
    </Root>
  );
};

export default ClubManagersList;
