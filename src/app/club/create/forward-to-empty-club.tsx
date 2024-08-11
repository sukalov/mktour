'use client';

import { forwardAction } from '@/app/club/create/forward-action';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DatabaseClub } from '@/lib/db/schema/tournaments';
import { ArrowRight } from 'lucide-react';

export default function ForwardToEmpryClub({
  club,
  userId,
}: {
  club: DatabaseClub;
  userId: string;
}) {
  return (
    <div className="p-4">
      <Card className="mx-auto max-w-[min(600px,98%)] border-none shadow-none sm:border-solid sm:shadow-sm">
        <CardContent className="flex flex-col gap-4 p-4 pt-2 sm:p-8">
          <p>
            we&apos;ve found, you have a club with no finished tournaments:{' '}
            {club.name}. you can just edit that one!
          </p>
          <Button
            className="group"
            onClick={async () =>
              await forwardAction({ clubId: club.id, userId })
            }
          >
            go to {club.name}&apos;s dashboard&nbsp;
            <ArrowRight className="group-hover:translate-x-1 transition-all duration-200" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
