'use client';

import DeleteConfirmationForm, {
    DeleteConfirmationFormProps,
} from '@/app/clubs/my/(tabs)/club-delete-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer';
import { useTranslations } from 'next-intl';
import * as React from 'react';
import { useMediaQuery } from 'react-responsive';

export default function ClubDelete({
  id,
  userId,
}: DeleteConfirmationFormProps) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery({ minWidth: 768 });
  const t = useTranslations('Club.Settings');
  if (isDesktop) {
    return (
      <Card className="border-none shadow-none sm:border-solid sm:shadow-2xs">
        <CardHeader>{t('danger zone')}</CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">{t('delete club')}</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{t('confirmation title')}</DialogTitle>
                <DialogDescription>{t('confirmation body')}</DialogDescription>
              </DialogHeader>
              <DeleteConfirmationForm id={id} userId={userId} />
              <DialogClose asChild>
                <Button variant="outline">{t('cancel')}</Button>
              </DialogClose>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-none sm:border-solid sm:shadow-2xs">
      <CardHeader>{t('danger zone')}</CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <Button variant="destructive">{t('delete club')}</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader className="text-left">
              <DrawerTitle>{t('confirmation title')}</DrawerTitle>
              <DrawerDescription>{t('confirmation body')}</DrawerDescription>
            </DrawerHeader>
            <DeleteConfirmationForm id={id} userId={userId} />
            <DrawerFooter className="pt-2">
              <DrawerClose asChild>
                <Button variant="outline">{t('cancel')}</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </CardContent>
    </Card>
  );
}
