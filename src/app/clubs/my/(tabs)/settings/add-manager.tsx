import { useClubAddManagerMutation } from '@/components/hooks/mutation-hooks/use-club-add-manager';
import { useClubAffiliatedUsers } from '@/components/hooks/query-hooks/use-club-affiliated-users';
import { useClubManagers } from '@/components/hooks/query-hooks/use-club-managers';
import { useSearchQuery } from '@/components/hooks/query-hooks/use-search-result';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { DatabaseUser } from '@/server/db/schema/users';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
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
        <p className="text-muted-foreground px-8 pt-8 text-center text-sm text-balance">
          {t('no affiliated users')}
        </p>
      )}
      <ScrollArea className="rounded-2 h-[calc(100dvh-6rem)] w-full rounded-b-md">
        <Table>
          <TableBody>
            {users?.map((user) => (
              <>
                {!managers.data?.some(
                  (manager) => manager.user.id === user.id,
                ) && (
                  <TableRow key={user.id} className="p-0">
                    {promotingUser && promotingUser.id === user.id ? (
                      <TableCell className="grid grid-cols-3 gap-1.5 p-1.5">
                        <Button
                          disabled={isPending}
                          onClick={() =>
                            mutate({ clubId, userId: user.id, status: 'admin' })
                          }
                        >
                          {t('make admin')}
                        </Button>
                        <Button
                          disabled={isPending}
                          variant="destructive"
                          onClick={() =>
                            mutate({
                              clubId,
                              userId: user.id,
                              status: 'co-owner',
                            })
                          }
                        >
                          {t('make co-owner')}
                        </Button>
                        <Button
                          disabled={isPending}
                          variant="secondary"
                          onClick={() => setPromotingUser(undefined)}
                        >
                          {t('cancel')}
                        </Button>
                      </TableCell>
                    ) : (
                      <TableCell onClick={() => setPromotingUser(user)}>
                        <p className="line-clamp-2 break-all">
                          {user.username}
                        </p>{' '}
                      </TableCell>
                    )}
                  </TableRow>
                )}
              </>
            ))}
          </TableBody>
        </Table>
        <div className="h-24 w-full grow" />
      </ScrollArea>
    </div>
  );
};

export default AddManager;
