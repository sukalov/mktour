'use client';
import ClubDashboardTournaments from '@/app/club/dashboard/(tabs)/tournaments-list';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { FC, PropsWithChildren } from 'react';

const ClubPage: FC<ClubProps> = ({ club }) => {
  const t = useTranslations();

  return (
    <div className="space-y-4 p-4">
      <ClubCard club={club}>
        {club.lichess_team && (
          <Link
            href={`https://lichess.org/team/${club.lichess_team}`}
            target="_blank"
          >
            {t('Club.Page.lichess team')}
          </Link>
        )}
      </ClubCard>
      <div className="flex flex-col gap-2">
        <p>{t('Club.Page.tournaments')}</p>
        <ClubDashboardTournaments selectedClub={club.id} userId="" />
      </div>
    </div>
  );
};

export const ClubCard: FC<PropsWithChildren & ClubProps> = ({
  club,
  children,
}) => {
  const locale = useLocale();
  const t = useTranslations();

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>{club.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm">
          {club.description || t('Club.Page.no description')}
        </p>
        {children}
        <p className="text-muted-foreground mt-2 text-xs">
          {club.created_at &&
            t('Club.Page.createdAt', {
              date: club.created_at!.toLocaleDateString(locale, {
                dateStyle: 'long',
              }),
            })}
        </p>
      </CardContent>
    </Card>
  );
};

interface ClubProps {
  club: {
    name: string;
    description: string | null;
    id: string;
    created_at: Date | null;
    lichess_team: string | null;
  };
}

export default ClubPage;
