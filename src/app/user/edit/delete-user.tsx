'use client';

import DeleteUserForm from '@/app/user/edit/delete-user-form';
import RichText from '@/components/rich-text';
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

export default function DeleteUser({ userId }: DeleteProfileProps) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery({ minWidth: 768 });
  const t = useTranslations('EditUser');
  if (isDesktop) {
    return (
      <Card className="w-full border-none shadow-none md:border-solid md:shadow-2xs">
        <CardHeader>{t('danger zone')}</CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">{t('delete profile')}</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{t('confirmation header')}</DialogTitle>
                <DialogDescription>
                  <RichText>
                    {(tags) => t.rich('confirmation body', tags)}
                  </RichText>
                </DialogDescription>
              </DialogHeader>
              <DeleteUserForm userId={userId} />
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
    <Card className="w-full border-none shadow-none sm:border-solid sm:shadow-2xs">
      <CardHeader>{t('danger zone')}</CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <Button variant="destructive">{t('delete profile')}</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader className="text-left">
              <DrawerTitle>{t('confirmation header')}</DrawerTitle>
              <DrawerDescription>
                {t.rich('confirmation body')}
              </DrawerDescription>
            </DrawerHeader>
            <DeleteUserForm userId={userId} />
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

interface DeleteProfileProps {
  userId: string;
}
