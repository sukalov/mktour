import { Card, CardTitle } from '@/components/ui/card';
import LichessLogo from '@/components/ui/lichess-logo';
import { DatabaseClub } from '@/server/db/schema/clubs';
import { getLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { FC } from 'react';

const ClubCard: FC<{ club: DatabaseClub }> = async ({ club }) => {
  const t = await getTranslations();
  const locale = await getLocale();

  return (
    <Link href={`/clubs/${club.id}`}>
      <Card className="mk-card flex flex-col shadow-sm">
        <div className="flex items-center gap-2">
          <CardTitle className="text-xs">{club.name}</CardTitle>
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

        <p className="text-muted-foreground text-2xs">
          {club.created_at &&
            t('Club.Page.createdAt', {
              date: club.created_at.toLocaleDateString(locale, {
                dateStyle: 'long',
              }),
            })}
        </p>
      </Card>
    </Link>
  );
};

export default ClubCard;
