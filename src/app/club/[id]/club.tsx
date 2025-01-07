'use client';

import ClubDashboardTournaments from '@/app/club/dashboard/(tabs)/tournaments-list';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { FC } from 'react';

const ClubPage: FC<ClubProps> = ({ club }) => {
  const locale = useLocale();
  const t = useTranslations();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-4 p-4"
    >
      <Card key={club.id} className="shadow-lg">
        <CardHeader>
          <CardTitle>{club.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            {club.description || t('Club.Page.no description')}
          </p>
          {club.lichess_team && (
            <Link
              href={`https://lichess.org/team/${club.lichess_team}`}
              target="_blank"
            >
              t('Club.Page.lichess team')
            </Link>
          )}
          <p className="mt-2 text-xs text-gray-400">
            {club.created_at &&
              t('Club.Page.createdAt', {
                date: club.created_at!.toLocaleDateString(locale, {
                  dateStyle: 'long',
                }),
              })}
          </p>
        </CardContent>
      </Card>
      <ClubDashboardTournaments selectedClub={club.id} userId="" />
    </motion.div>
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
