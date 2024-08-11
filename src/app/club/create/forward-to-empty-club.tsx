'use client';

import { forwardAction } from '@/app/club/create/forward-action';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
  const t = useTranslations('NewClubForm.ForwardToEmpty')
  return (
    <div className="p-4">
      <Card className="mx-auto max-w-[min(600px,98%)] border-none shadow-none sm:border-solid sm:shadow-sm">
        <CardContent className="flex flex-col gap-4 p-4 pt-2 sm:p-8">
          <p>
            {t('first message')}&nbsp;
            <span className='font-bold'>{club.name}</span>{t('second message')}
          </p>
          <Button
            className="group"
            onClick={async () =>
              await forwardAction({ clubId: club.id, userId })
            }
          >
            {t('button text')}&nbsp;{club.name}&nbsp;
            <ArrowRight className="transition-all duration-200 group-hover:translate-x-1" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
