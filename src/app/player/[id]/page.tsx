import Loading from '@/app/loading';
import ClaimPlayer from '@/app/player/[id]/claim-button';
import EditButton from '@/app/player/[id]/edit-button';
import LastTournaments from '@/app/player/[id]/last-tournaments';
import HalfCard from '@/components/ui-custom/half-card';
import LichessLogo from '@/components/ui-custom/lichess-logo';
import { Button } from '@/components/ui/button';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { publicCaller } from '@/server/api';
import {
  ChevronRight,
  Percent,
  Swords,
  Target,
  TrendingUp,
  Trophy,
  User2,
  Users2,
  UserX,
} from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FC, Suspense } from 'react';
import 'server-only';

export default async function PlayerPage(props: PlayerPageProps) {
  return (
    <Suspense fallback={<Loading />}>
      <PlayerPageContent {...props} />
    </Suspense>
  );
}

async function PlayerPageContent(props: PlayerPageProps) {
  const { id } = await props.params;
  const [user, playerData] = await Promise.all([
    publicCaller.auth.info(),
    publicCaller.player.info({ playerId: id }),
  ]);
  if (!playerData) notFound();

  const { user: playerUser, club, ...player } = playerData;
  const status = await publicCaller.club.authStatus({
    clubId: club.id,
  });
  const playerLastTournaments = await publicCaller.player.lastTournaments({
    playerId: player.id,
  });

  const isOwnPlayer = user && player.userId === user.id;
  const canEdit = status !== null || isOwnPlayer;
  const canClaim = !status && user && !player.userId;
  const t = await getTranslations('Player');

  // FIXME: mock data
  // Mock stats data - replace with real API later
  const mockStats = {
    gamesPlayed: { value: 47, rank: 1 },
    winRate: { value: 62, rank: 3 },
    peakRating: { value: player.rating + 85, rank: 2 },
    tournamentsPlayed: { value: playerLastTournaments?.length ?? 0, rank: 5 },
  };

  // Mock H2H data - only shown when user is logged in and viewing another player
  const mockH2H =
    user && player.userId !== user.id
      ? {
          opponentNickname: 'you', // would be auth user's player nickname in this club
          playerWins: 5,
          opponentWins: 3,
          draws: 2,
          lastTournamentId: playerLastTournaments?.[0]?.tournament.id, // mock: last tournament they played in
        }
      : null;

  return (
    <div className="mk-container flex w-full flex-col gap-4">
      {/* Club Context Bar */}
      <Link
        href={`/clubs/${club.id}`}
        className="bg-secondary/50 hover:bg-secondary/70 flex items-center justify-between rounded-lg px-4 py-3 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Users2 className="text-muted-foreground size-4" />
          <span className="text-sm font-medium">{club.name}</span>
        </div>
        <ChevronRight className="text-muted-foreground size-4" />
      </Link>

      {/* Action Toolbar */}
      <div className="flex w-full justify-end gap-2">
        {playerUser ? (
          <Button variant="outline" className="gap-2" asChild>
            <Link href={`/user/${playerUser.username}`}>
              <User2 className="size-4" />
              <span>{playerUser.username}</span>
            </Link>
          </Button>
        ) : (
          <Button variant="outline" className="gap-2" disabled>
            <UserX className="size-4" />
            <span>{t('not linked')}</span>
          </Button>
        )}
        {playerUser && (
          <Button variant="outline" size="icon" className="gap-2" asChild>
            <Link
              href={`https://lichess.org/@/${playerUser.username}`}
              target="_blank"
            >
              <div className="size-4">
                <LichessLogo />
              </div>
            </Link>
          </Button>
        )}
        {user && canEdit && (
          <EditButton userId={user.id} player={player} status={status} />
        )}
        {user && canClaim && <ClaimPlayer userId={user.id} clubId={club.id} />}
      </div>

      {/* Player Info + Stats */}
      <HalfCard>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <CardTitle className="text-2xl">{player.nickname}</CardTitle>
              {player.realname && (
                <span className="text-muted-foreground text-sm">
                  {player.realname}
                </span>
              )}
            </div>
            <div className="flex flex-col items-end">
              <span className="text-3xl font-bold">{player.rating}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-3">
            <StatItem
              icon={Trophy}
              label={t('Stats.tournaments')}
              value={mockStats.tournamentsPlayed.value}
              rank={mockStats.tournamentsPlayed.rank}
            />
            <StatItem
              icon={Swords}
              label={t('Stats.gamesPlayed')}
              value={mockStats.gamesPlayed.value}
              rank={mockStats.gamesPlayed.rank}
            />
            <StatItem
              icon={Percent}
              label={t('Stats.winRate')}
              value={`${mockStats.winRate.value}%`}
              rank={mockStats.winRate.rank}
            />
            <StatItem
              icon={TrendingUp}
              label={t('Stats.peakRating')}
              value={mockStats.peakRating.value}
              rank={mockStats.peakRating.rank}
            />
          </div>
        </CardContent>
      </HalfCard>

      {/* Head to Head */}
      {user && (
        <HalfCard>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="size-4" />
              {t('Stats.h2h')}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {mockH2H ? (
              <H2HDisplay
                playerNickname={player.nickname}
                opponentNickname={mockH2H.opponentNickname}
                playerWins={mockH2H.playerWins}
                opponentWins={mockH2H.opponentWins}
                draws={mockH2H.draws}
                lastTournamentId={mockH2H.lastTournamentId}
              />
            ) : (
              <p className="text-muted-foreground text-sm">
                {t('Stats.h2hEmpty')}
              </p>
            )}
          </CardContent>
        </HalfCard>
      )}

      <LastTournaments tournaments={playerLastTournaments} />
    </div>
  );
}

const StatItem: FC<{
  icon: FC<{ className?: string }>;
  label: string;
  value: string | number;
  rank?: number;
}> = ({ icon: Icon, label, value, rank }) => {
  return (
    <div
      className={`bg-muted/50 flex flex-row items-center justify-center gap-4 rounded-lg p-4`}
    >
      <Icon className={`text-muted-foreground size-5`} />
      <div className="flex flex-col">
        <span className={`text-primary text-lg font-semibold`}>{value}</span>
        <span className="text-muted-foreground text-left text-xs">{label}</span>
      </div>
      <div className="flex-1" />
      {rank !== undefined && (
        <span className={'text-muted-foreground text-xs'}>#{rank}</span>
      )}
    </div>
  );
};

const H2HDisplay: FC<{
  playerNickname: string;
  opponentNickname: string;
  playerWins: number;
  opponentWins: number;
  draws: number;
  lastTournamentId?: string;
}> = ({
  playerNickname,
  opponentNickname,
  playerWins,
  opponentWins,
  draws,
}) => {
  const playerScore = playerWins + draws * 0.5;
  const opponentScore = opponentWins + draws * 0.5;

  return (
    <div className="flex flex-col gap-2">
      {/* Names, scores, and W-D-L */}
      <div className="flex items-start justify-center gap-4">
        <span className="text-muted-foreground flex-1 pt-1 text-right text-sm">
          {playerNickname}
        </span>
        <div className="flex flex-col items-center">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">{playerScore}</span>
            <span className="text-muted-foreground">:</span>
            <span className="text-2xl font-bold">{opponentScore}</span>
          </div>
          <span className="text-muted-foreground text-xs">
            ({playerWins}-{draws}-{opponentWins})
          </span>
        </div>
        <span className="text-muted-foreground flex-1 pt-1 text-left text-sm">
          {opponentNickname}
        </span>
      </div>
    </div>
  );
};

export interface PlayerPageProps {
  params: Promise<{ id: string }>;
}
