'use client';

import DeleteConfirmationForm from '@/app/clubs/my/(tabs)/settings/delete-form';
import { Button } from '@/components/ui/button';
import ComboModal from '@/components/ui/combo-modal';
import { useTranslations } from 'next-intl';
import * as React from 'react';

export default function ClubDelete({ id, userId }: ClubDeleteProps) {
  const [open, setOpen] = React.useState(false);
  const t = useTranslations('Club.Settings');

  return (
    <ComboModal.Root open={open} onOpenChange={setOpen}>
      <ComboModal.Trigger asChild>
        <Button variant="destructive">{t('delete club')}</Button>
      </ComboModal.Trigger>
      <ComboModal.Content>
        <ComboModal.Header>
          <ComboModal.Title>{t('confirmation title')}</ComboModal.Title>
          <ComboModal.Description>
            {t('confirmation body')}
          </ComboModal.Description>
        </ComboModal.Header>
        <DeleteConfirmationForm
          id={id}
          userId={userId}
          setOpenAction={setOpen}
        />
        <ComboModal.Close asChild>
          <Button variant="outline" className="w-full">
            {t('cancel')}
          </Button>
        </ComboModal.Close>
      </ComboModal.Content>
    </ComboModal.Root>
  );
}

interface ClubDeleteProps {
  className?: string;
  id: string;
  userId: string;
}
