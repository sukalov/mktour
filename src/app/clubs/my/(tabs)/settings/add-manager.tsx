import { useClubAddManagerMutation } from '@/components/hooks/mutation-hooks/use-club-add-manager';
import { useClubAffiliatedUsers } from '@/components/hooks/query-hooks/use-club-affiliated-users';
import { useClubManagers } from '@/components/hooks/query-hooks/use-club-managers';
import { useSearchQuery } from '@/components/hooks/query-hooks/use-search-result';
import { Button, ButtonProps } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { DatabaseUser } from '@/server/db/schema/users';
import { useTranslations } from 'next-intl';
import { FC, PropsWithChildren, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { toast } from 'sonner';

const AddManager = ({
  handleClose,
  clubId,
  debouncedValue,
  userId,
}: {
  handleClose: () => void;
  clubId: string;
  debouncedValue: string;
  userId: string;
}) => {
  const [promotingUser, setPromotingUser] = useState<DatabaseUser | undefined>(
    undefined,
  );
  const affiliatedUsers = useClubAffiliatedUsers(clubId);
  const foundUsers = useSearchQuery({
    userId,
    query: debouncedValue,
    filter: 'users',
  });
  const managers = useClubManagers(clubId);

  const { mutate, isPending } = useClubAddManagerMutation();

  const t = useTranslations('Club.Settings');
  useHotkeys('escape', () => handleClose, { enableOnFormTags: true });

  if (affiliatedUsers.status === 'pending' || foundUsers.status === 'pending')
    return <Skeleton className="h-svh w-full pt-8" />;
  if (affiliatedUsers.status === 'error' || foundUsers.status === 'error') {
    toast.error(t('search users error'), {
      id: 'query-users',
      duration: 3000,
    });
    return <Skeleton className="h-svh w-full pt-8" />;
  }

  let users: DatabaseUser[];
  if (debouncedValue === '') {
    users = affiliatedUsers.data;
  } else {
    users = foundUsers.data.users;
  }

  return (
    <div className="flex flex-col">
      {users.length === 0 && debouncedValue === '' && (
        <p className="text-muted-foreground p-4 text-center text-sm text-balance">
          {t('no affiliated users')}
        </p>
      )}
      <ScrollArea className="rounded-2 h-[calc(100dvh-6rem)] w-full rounded-b-md">
        <Table>
          <TableBody>
            {users
              ?.filter(
                (user) =>
                  !managers.data?.some(
                    (manager) => manager.user.id === user.id,
                  ),
              )
              .map((user) => (
                <TableRow
                  key={user.id}
                  className="flex flex-col gap-2 rounded-md p-0"
                >
                  <TableCell
                    className={`relative flex h-full cursor-pointer flex-col`}
                    onClick={() =>
                      setPromotingUser(
                        promotingUser?.id === user.id ? undefined : user,
                      )
                    }
                  >
                    <p className="line-clamp-2 break-all">{user.username}</p>
                    <div
                      className={`${promotingUser?.id === user.id ? 'max-h-32 pt-2' : 'max-h-0'} flex w-full flex-wrap gap-2 overflow-hidden transition-all duration-300 ease-in-out`}
                    >
                      <ActionButton
                        disabled={isPending}
                        onClick={(event) => {
                          event.stopPropagation();
                          mutate({
                            clubId,
                            userId: user.id,
                            status: 'admin',
                          });
                        }}
                      >
                        {t('make admin')}
                      </ActionButton>
                      <ActionButton
                        disabled={isPending}
                        variant="destructive"
                        onClick={(event) => {
                          event.stopPropagation();
                          mutate({
                            clubId,
                            userId: user.id,
                            status: 'co-owner',
                          });
                        }}
                      >
                        {t('make co-owner')}
                      </ActionButton>
                      <ActionButton
                        disabled={isPending}
                        variant="outline"
                        onClick={(event) => {
                          event.stopPropagation();
                          setPromotingUser(undefined);
                        }}
                      >
                        {t('cancel')}
                      </ActionButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <div className="h-24 w-full grow" />
      </ScrollArea>
    </div>
  );
};

const ActionButton: FC<ButtonProps & PropsWithChildren> = ({
  children,
  ...props
}) => (
  <Button className="min-w-30 flex-1" size="sm" {...props}>
    <div className="text-mk-xs">{children}</div>
  </Button>
);

export default AddManager;
