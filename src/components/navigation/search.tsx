'use client';
// global search

import { Search } from 'lucide-react';
import * as React from 'react';

import { useSearchQuery } from '@/components/hooks/query-hooks/use-search-result';
import { useDebounce } from '@/components/hooks/use-debounce';
import { Button } from '@/components/ui/button';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';
import { DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { DatabaseClub } from '@/server/db/schema/clubs';
import { DatabasePlayer } from '@/server/db/db/schema/players';
import { DatabaseUser } from '@/server/db/db/schema/users';
import { User } from 'lucia';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

export default function GlobalSearch({ user }: { user: User | null }) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const { data, isLoading } = useSearchQuery({
    userId: user?.id,
    query: debouncedSearchQuery,
    filter: undefined,
  });
  const router = useRouter();

  const actions: Array<{
    title: string;
    shortcut: string;
    onClick: () => void;
  }> = [
    {
      title: 'make tournament',
      shortcut: '⌘M',
      onClick: () => router.push('/tournaments/create'),
    },
    {
      title: 'edit club',
      shortcut: '⌘C',
      onClick: () => router.push('/clubs/my'),
    },
    {
      title: 'edit profile',
      shortcut: '⌘P',
      onClick: () => router.push('/user/edit'),
    },
  ];

  const filteredActions = actions.filter((action) =>
    action.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
      if (e.key === 'm' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(false);
        router.push('/tournaments/create');
      }
      if (e.key === 'c' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(false);
        router.push('/clubs/my');
      }
      if (e.key === 'p' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(false);
        router.push('/user/edit');
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [router]);

  const t = useTranslations('GlobalSearch');

  return (
    <>
      <Button
        variant="ghost"
        className="flex flex-row items-center justify-center gap-1 p-3 text-sm"
        onClick={() => setOpen((prev) => !prev)}
      >
        <Search className="size-5" />
        <kbd className="bg-muted text-muted-foreground pointer-events-none hidden h-6 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none lg:inline-flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        shouldFilter={isLoading ? false : true}
      >
        <DialogTitle className="sr-only">
          {t('search dialog title')}
        </DialogTitle>{' '}
        <DialogDescription className="sr-only">
          {t('search dialog description')}
        </DialogDescription>
        <div
          className="border-b-0.5 flex items-center px-3"
          cmdk-input-wrapper=""
        >
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <input
            type="text"
            placeholder={t('search placeholder')}
            className={
              'placeholder:text-muted-foreground flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50'
            }
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <CommandList>
          <CommandEmpty>{t('not found')}</CommandEmpty>
          {data && (
            <>
              {data?.users && data?.users.length > 0 && (
                <>
                  <CommandGroup heading="users">
                    {data.users.map((item: DatabaseUser) => (
                      <CommandItem
                        key={item.id}
                        value={item.id}
                        onSelect={() => router.push(`/user/${item.username}`)}
                      >
                        <span>{item.username}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  <CommandSeparator />
                </>
              )}
              {data.clubs && data.clubs.length > 0 && (
                <>
                  <CommandGroup heading="clubs">
                    {data.clubs.map((item: DatabaseClub) => (
                      <CommandItem
                        key={item.id}
                        value={item.id}
                        onSelect={() => router.push(`/clubs/${item.id}`)}
                      >
                        <span>{item.name}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  <CommandSeparator />
                </>
              )}

              {data.tournaments && data.tournaments.length > 0 && (
                <CommandGroup heading="tournaments">
                  {data.tournaments.map((item) => (
                    <CommandItem
                      key={item.id}
                      value={item.id}
                      onSelect={() => router.push(`/tournaments/${item.id}`)}
                    >
                      <span>{item.title}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              <CommandSeparator />
              {data?.players && data?.players.length > 0 && (
                <>
                  <CommandGroup heading="players">
                    {data.players.map((item: DatabasePlayer) => (
                      <CommandItem
                        key={item.id}
                        value={item.id}
                        onSelect={() => router.push(`/player/${item.id}`)}
                      >
                        <span>{item.nickname}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  <CommandSeparator />
                </>
              )}
            </>
          )}
          <CommandGroup heading="actions">
            {filteredActions.map((action) => (
              <CommandItem
                key={action.title}
                value={action.title}
                onSelect={action.onClick}
              >
                <span>{action.title}</span>
                <CommandShortcut>{action.shortcut}</CommandShortcut>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
