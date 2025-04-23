'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LichessLogo from '@/components/ui/lichess-logo';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { FC } from 'react';

const ClubCard: FC<ClubProps> = ({ club }) => {
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
        {club.lichess_team && (
          <Link
            href={`https://lichess.org/team/${club.lichess_team}`}
            target="_blank"
          >
            <p className="flex items-center gap-2">
              <LichessLogo />
              {t('Club.Page.lichess team')}
            </p>
          </Link>
        )}
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

export type ClubProps = {
  club: {
    name: string;
    description: string | null;
    id: string;
    created_at: Date | null;
    lichess_team: string | null;
  };
};

export default ClubCard;
