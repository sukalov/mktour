'use client';

import { Card, CardTitle } from '@/components/ui/card';
import LichessLogo from '@/components/ui/lichess-logo';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { FC } from 'react';

const ClubCard: FC<ClubProps> = ({ club }) => {
  const locale = useLocale();
  const t = useTranslations();

  return (
    <Card className="mk-card flex flex-col shadow-lg">
      <CardTitle className="flex items-center gap-2 text-sm">
        <Link href={`/clubs/${club.id}`}>{club.name}</Link>
        {club.lichess_team && (
          <Link
            href={`https://lichess.org/team/${club.lichess_team}`}
            target="_blank"
            className="size-4"
          >
            <LichessLogo />
          </Link>
        )}
      </CardTitle>
      {club.description && (
        <span className="text-muted-foreground text-sm">
          {club.description || t('Club.Page.no description')}
        </span>
      )}

      <p className="text-muted-foreground text-xs">
        {club.created_at &&
          t('Club.Page.createdAt', {
            date: club.created_at!.toLocaleDateString(locale, {
              dateStyle: 'long',
            }),
          })}
      </p>
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
