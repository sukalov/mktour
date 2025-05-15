import { useClubAffiliatedUsers } from '@/components/hooks/query-hooks/use-club-affiliated-users';
import { useSearchQuery } from '@/components/hooks/query-hooks/use-search-result';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { DatabaseUser } from '@/lib/db/schema/users';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { toast } from 'sonner';

const AddManager = ({
  handleClose,
  clubId,
  debouncedValue,
  setValue,
  userId,
}: {
  handleClose: () => void;
  clubId: string;
  debouncedValue: string;
  setValue: (_arg: string) => void;
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
              <TableRow
                key={user.id}
                onClick={() => {
                  setValue('');
                }}
                className="p-0"
              >
                {promotingUser && promotingUser.id === user.id ? (
                  <TableCell className="grid grid-cols-3 gap-1.5 p-1.5">
                    <Button>{t('make admin')}</Button>
                    <Button variant="destructive">{t('make co-owner')}</Button>
                    <Button
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
            ))}
          </TableBody>
        </Table>
        <div className="h-24 w-full grow" />
      </ScrollArea>
    </div>
  );
};

export default AddManager;
