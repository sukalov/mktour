'use client';

import { usePlayerAuthStats } from '@/components/hooks/query-hooks/use-player-stats';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Target } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FC } from 'react';

interface AuthStatsCardProps {
  playerId: string;
  clubId: string;
  playerNickname: string;
}

const AuthStatsCard: FC<AuthStatsCardProps> = ({
  playerId,
  clubId,
  playerNickname,
}) => {
  const { data: authStats, isPending } = usePlayerAuthStats(playerId);
  const t = useTranslations('Player.Stats');

  if (!isPending && !authStats) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Target className="size-4" />
          {t('h2h')}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {isPending ? (
          <H2HSkeleton />
        ) : authStats ? (
          <H2HDisplay
            playerNickname={playerNickname}
            opponentNickname={`${authStats.userPlayerNickname} (${t('you')})`}
            playerWins={authStats.playerWins}
            opponentWins={authStats.userWins}
            draws={authStats.draws}
          />
        ) : (
          <p className="text-muted-foreground text-sm">{t('h2hEmpty')}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default AuthStatsCard;

interface H2HDisplayProps {
  playerNickname: string;
  opponentNickname: string;
  playerWins: number;
  opponentWins: number;
  draws: number;
}

const H2HDisplay: FC<H2HDisplayProps> = ({
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

const H2HSkeleton: FC = () => (
  <div className="flex flex-col gap-2">
    <div className="flex items-start justify-center gap-4">
      <Skeleton className="h-4 w-20 flex-1" />
      <div className="flex flex-col items-center gap-1">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-3 w-16" />
      </div>
      <Skeleton className="h-4 w-20 flex-1" />
    </div>
  </div>
);
