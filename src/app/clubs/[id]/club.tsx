'use client';

import FormattedMessage from '@/components/formatted-message';
import { useAuthSelectClub } from '@/components/hooks/mutation-hooks/use-auth-select-club';
import { useClubPlayers } from '@/components/hooks/query-hooks/use-club-players';
import { useClubStats } from '@/components/hooks/query-hooks/use-club-stats';
import { useClubTournaments } from '@/components/hooks/query-hooks/use-club-tournaments';
import { useAuth } from '@/components/hooks/query-hooks/use-user';
import SkeletonList from '@/components/skeleton-list';
import TournamentItemIteratee from '@/components/tournament-item';
import { useTRPC } from '@/components/trpc/client';
import HalfCard from '@/components/ui-custom/half-card';
import LichessLogo from '@/components/ui-custom/lichess-logo';
import Paginator from '@/components/ui-custom/paginator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DatabaseClub } from '@/server/db/schema/clubs';
import { DatabasePlayer } from '@/server/db/schema/players';
import { StatusInClub } from '@/server/db/zod/enums';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  CalendarDays,
  Home,
  Search,
  Shield,
  Trophy,
  Users2,
} from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { FC, useMemo, useState } from 'react';

const ClubPage: FC<{
  club: DatabaseClub;
  statusInClub: StatusInClub | null;
  userId: string;
}> = ({ club, statusInClub, userId }) => {
  const props = { selectedClub: club.id, userId, statusInClub };

  return (
    <div className="mk-container flex flex-col gap-6">
      <ClubHeader club={club} statusInClub={statusInClub} />
      <ClubStats clubId={club.id} />
      <ClubManagers clubId={club.id} />
      <MostActivePlayers clubId={club.id} />

      <div className="hidden gap-6 md:grid md:grid-cols-2">
        <ClubTournamentsSection clubId={club.id} statusInClub={statusInClub} />
        <ClubPlayersSection clubId={club.id} />
      </div>

      <div className="md:hidden">
        <Tabs defaultValue="tournaments" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tournaments">
              <FormattedMessage id="Menu.tournaments" />
            </TabsTrigger>
            <TabsTrigger value="players">
              <FormattedMessage id="Club.Dashboard.players" />
            </TabsTrigger>
          </TabsList>
          <TabsContent value="tournaments">
            <ClubTournamentsSection
              clubId={club.id}
              statusInClub={statusInClub}
            />
          </TabsContent>
          <TabsContent value="players">
            <ClubPlayersSection clubId={club.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const ClubHeader: FC<{
  club: DatabaseClub;
  statusInClub: StatusInClub | null;
}> = ({ club, statusInClub }) => {
  const t = useTranslations('Club');
  const locale = useLocale();
  const queryClient = useQueryClient();
  const { data: user } = useAuth();
  const { mutate } = useAuthSelectClub(queryClient);

  return (
    <HalfCard>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <CardTitle className="text-2xl">{club.name}</CardTitle>
              {club.lichessTeam && (
                <Link
                  href={`https://lichess.org/team/${club.lichessTeam}`}
                  target="_blank"
                  className="transition-opacity hover:opacity-70"
                >
                  <LichessLogo className="size-5" />
                </Link>
              )}
            </div>
            {club.description && (
              <span className="text-muted-foreground text-sm">
                {club.description}
              </span>
            )}
          </div>
          {user && statusInClub && (
            <Button variant="outline" className="shrink-0 gap-2" asChild>
              <Link
                prefetch={false}
                onNavigate={() => {
                  mutate({ clubId: club.id });
                }}
                href="/clubs/my"
              >
                <Home className="size-4" />
                <span className="hidden sm:inline">{t('dashboard')}</span>
              </Link>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <Separator className="mb-4" />
        <div className="text-muted-foreground flex items-center gap-3 text-xs">
          <CalendarDays className="size-4" />
          {club.createdAt &&
            t('Page.createdAt', {
              date: club.createdAt.toLocaleDateString(locale, {
                dateStyle: 'long',
              }),
            })}
        </div>
      </CardContent>
    </HalfCard>
  );
};

const ClubStats: FC<{ clubId: string }> = ({ clubId }) => {
  const { data: stats, isPending } = useClubStats(clubId);
  const t = useTranslations('Club.Stats');

  return (
    <div className="grid grid-cols-2 gap-3">
      <StatCard
        icon={Users2}
        label={t('players')}
        value={stats?.playersCount}
        isLoading={isPending}
      />
      <StatCard
        icon={Trophy}
        label={t('tournaments')}
        value={stats?.tournamentsCount}
        isLoading={isPending}
      />
    </div>
  );
};

const StatCard: FC<{
  icon: FC<{ className?: string }>;
  label: string;
  value?: number;
  isLoading?: boolean;
}> = ({ icon: Icon, label, value, isLoading }) => (
  <div className="bg-primary/5 border-primary/10 flex items-center gap-4 rounded-xl border p-4">
    <div className="bg-primary/10 flex size-10 items-center justify-center rounded-lg">
      <Icon className="text-primary size-5" />
    </div>
    <div className="flex flex-col">
      {isLoading ? (
        <>
          <Skeleton className="mb-1 h-6 w-12" />
          <Skeleton className="h-3 w-16" />
        </>
      ) : (
        <>
          <span className="text-2xl font-bold">{value ?? 0}</span>
          <span className="text-muted-foreground text-xs">{label}</span>
        </>
      )}
    </div>
  </div>
);

const ClubManagers: FC<{ clubId: string }> = ({ clubId }) => {
  const trpc = useTRPC();
  const { data: managers, isPending } = useQuery(
    trpc.club.managers.all.queryOptions({ clubId }),
  );
  const t = useTranslations('Club');
  const tStatus = useTranslations('Status');

  if (isPending) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-24" />
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex gap-2">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-8 w-24 rounded-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!managers?.length) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Shield className="size-4" />
          {t('managers list')}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-2">
          {managers.map((manager) => (
            <Link
              key={manager.user.id}
              href={`/user/${manager.user.username}`}
              className="bg-muted hover:bg-muted/70 flex items-center gap-2 rounded-full px-3 py-1.5 transition-colors"
            >
              <span className="text-sm font-medium">
                {manager.user.username}
              </span>
              <span className="text-muted-foreground text-xs">
                {tStatus(manager.clubs_to_users.status)}
              </span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const MostActivePlayers: FC<{ clubId: string }> = ({ clubId }) => {
  const { data: stats, isPending } = useClubStats(clubId);
  const t = useTranslations('Club');

  if (isPending) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col gap-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats?.mostActivePlayers?.length) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Trophy className="size-4" />
          {t('mostActive')}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ul className="flex flex-col">
          {stats.mostActivePlayers.map((player, index) => (
            <li key={player.id}>
              {index > 0 && <Separator />}
              <Link
                href={`/player/${player.id}`}
                className="hover:bg-muted/50 -mx-2 flex items-center justify-between rounded-lg px-2 py-3 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground w-5 text-center text-sm">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium">{player.nickname}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-muted-foreground text-xs">
                    {player.tournamentsPlayed}{' '}
                    <FormattedMessage id="Club.Stats.tournamentsPlayed" />
                  </span>
                  <span className="text-sm font-medium">{player.rating}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

const ClubTournamentsSection: FC<{
  clubId: string;
  statusInClub: StatusInClub | null;
}> = ({ clubId, statusInClub }) => {
  const [search, setSearch] = useState('');
  const t = useTranslations();
  const { data, isLoading, isError } = useClubTournaments(clubId);

  const filteredTournaments = useMemo(() => {
    if (!data) return [];
    if (!search.trim()) return data;
    const lower = search.toLowerCase();
    return data.filter((t) => t.title?.toLowerCase().includes(lower));
  }, [data, search]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Trophy className="size-4" />
          <FormattedMessage id="Menu.tournaments" />
          {data && (
            <span className="text-muted-foreground font-normal">
              ({data.length})
            </span>
          )}
        </CardTitle>
        <div className="relative mt-2">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            placeholder={t('Common.search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </CardHeader>
      <CardContent className="max-h-[400px] overflow-y-auto pt-0">
        {isLoading && <SkeletonList length={4} />}
        {isError && (
          <p className="text-destructive text-sm">Error loading tournaments</p>
        )}
        {!isLoading && !isError && filteredTournaments.length === 0 && (
          <p className="text-muted-foreground py-4 text-center text-sm">
            {search ? t('GlobalSearch.not found') : t('Empty.tournaments')}
          </p>
        )}
        <div className="flex flex-col gap-2">
          {filteredTournaments.map((tournament) => (
            <TournamentItemIteratee
              key={tournament.id}
              tournament={tournament}
            />
          ))}
        </div>
        {statusInClub && !data?.length && (
          <Button size="sm" variant="default" className="mt-2 w-full" asChild>
            <Link href="/tournaments/create">
              <FormattedMessage id="Home.make tournament" />
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

const ClubPlayersSection: FC<{ clubId: string }> = ({ clubId }) => {
  const [search, setSearch] = useState('');
  const t = useTranslations();
  const { fetchNextPage, hasNextPage, isFetchingNextPage, ...players } =
    useClubPlayers(clubId);

  const allPlayers = players.data?.pages.flatMap((page) => page.players) ?? [];

  const filteredPlayers = useMemo(() => {
    if (!search.trim()) return allPlayers;
    const lower = search.toLowerCase();
    return allPlayers.filter((p) => p.nickname.toLowerCase().includes(lower));
  }, [allPlayers, search]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Users2 className="size-4" />
          <FormattedMessage id="Club.Dashboard.players" />
          {allPlayers.length > 0 && (
            <span className="text-muted-foreground font-normal">
              ({allPlayers.length})
            </span>
          )}
        </CardTitle>
        <div className="relative mt-2">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            placeholder={t('Common.search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </CardHeader>
      <CardContent className="max-h-[400px] overflow-y-auto pt-0">
        {players.status === 'pending' && (
          <SkeletonList length={4} className="h-14 rounded-xl" />
        )}
        {players.status === 'error' && (
          <p className="text-destructive text-sm">Error loading players</p>
        )}
        {players.status === 'success' && filteredPlayers.length === 0 && (
          <p className="text-muted-foreground py-4 text-center text-sm">
            {search ? t('GlobalSearch.not found') : t('Empty.players')}
          </p>
        )}
        <div className="flex flex-col gap-2">
          {filteredPlayers.map((player) => (
            <PlayerItem key={player.id} player={player} />
          ))}
        </div>
        {!search && (
          <Paginator
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
          />
        )}
      </CardContent>
    </Card>
  );
};

const PlayerItem: FC<{ player: DatabasePlayer }> = ({ player }) => {
  return (
    <Link href={`/player/${player.id}`}>
      <Card className="mk-card flex items-center justify-between truncate">
        <span className="text-sm">{player.nickname}</span>
        <div className="text-muted-foreground text-xs">{player.rating}</div>
      </Card>
    </Link>
  );
};

export default ClubPage;
