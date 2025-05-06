'use client';

import { Card, CardTitle } from '@/components/ui/card';
import LichessLogo from '@/components/ui/lichess-logo';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FC } from 'react';

const ClubCard: FC<ClubProps> = ({ club }) => {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations();

  return (
    <Card
      className="mk-card flex flex-col shadow-sm"
      onClick={() => router.push(`/clubs/${club.id}`)}
    >
      <div className="flex items-center gap-2">
        <CardTitle className="text-sm">{club.name}</CardTitle>
        {club.lichess_team && (
          <Link
            href={`https://lichess.org/team/${club.lichess_team}`}
            target="_blank"
            className="size-4"
          >
            <LichessLogo />
          </Link>
        )}
      </div>
      {club.description && (
        <span className="text-muted-foreground">
          {club.description || t('Club.Page.no description')}
        </span>
      )}
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
