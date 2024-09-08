'use client';

import { forwardAction } from '@/app/club/create/forward-action';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DatabaseClub } from '@/lib/db/schema/tournaments';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function ForwardToEmpryClub({
  club,
  userId,
}: {
  club: DatabaseClub;
  userId: string;
}) {
  const t = useTranslations('NewClubForm.ForwardToEmpty');
  return (
    <div className="p-4 py-2">
      <Card className="mx-auto flex max-w-[min(600px,98%)] flex-col gap-4 border-none shadow-none sm:border-solid sm:p-8 sm:shadow-sm">
        <div>
          {t.rich('message', {
            club: club.name,
          })}
        </div>
        <Button
          className="group py-8"
          onClick={async () => await forwardAction({ clubId: club.id, userId })}
        >
          <p>{`${t('button text')} ${club.name}`}</p>
          &nbsp;
          <ArrowRight className="transition-all duration-200 group-hover:translate-x-0.5" />
        </Button>
      </Card>
    </div>
  );
}
