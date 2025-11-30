'use client';

import { LoadingSpinner } from '@/app/loading';
import useAffiliationAuthMutation from '@/components/hooks/mutation-hooks/use-affiliation-auth';
import { Button } from '@/components/ui/button';
import { PlayerModel } from '@/server/db/zod/players';
import { Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FC } from 'react';

export const AffiliateButton: FC<{ player: PlayerModel }> = ({ player }) => {
  const t = useTranslations('Player');
  const { mutate, isPending } = useAffiliationAuthMutation();
  return (
    <Button
      variant="outline"
      onClick={() => mutate({ clubId: player.clubId, playerId: player.id })}
      disabled={isPending}
    >
      {isPending ? <LoadingSpinner /> : <Check />}
      {t('claim')}
    </Button>
  );
};
