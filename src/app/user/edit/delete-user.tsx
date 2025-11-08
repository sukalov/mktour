'use client';

import DeleteUserForm from '@/app/user/edit/delete-user-form';
import RichText from '@/components/rich-text';
import HalfCard from '@/components/ui-custom/half-card';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
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
      <>
        <h2 className="pl-4">{t('danger zone')}</h2>
        <HalfCard className="w-full">
          <CardContent className="p-mk flex flex-col gap-4 sm:p-8">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive">{t('delete profile')}</Button>
              </DialogTrigger>
              <DialogContent className="p-mk sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>{t('confirmation header')}</DialogTitle>
                  <DialogDescription className="sr-only" />
                  <div className="text-muted-foreground text-sm">
                    <RichText>
                      {(tags) => t.rich('confirmation body', tags)}
                    </RichText>
                  </div>
                </DialogHeader>
                <DeleteUserForm userId={userId} />
                <DialogClose asChild>
                  <Button variant="outline">{t('cancel')}</Button>
                </DialogClose>
              </DialogContent>
            </Dialog>
          </CardContent>
        </HalfCard>
      </>
    );
  }

  return (
    <>
      <h2 className="pl-4">{t('danger zone')}</h2>
      <HalfCard className="w-full">
        <CardContent className="p-mk-2 flex flex-col gap-4 sm:p-8">
          <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
              <Button variant="destructive">{t('delete profile')}</Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader className="text-left">
                <DrawerTitle>{t('confirmation header')}</DrawerTitle>
                <DrawerDescription className="sr-only" />
                <div className="text-muted-foreground text-sm">
                  <RichText>
                    {(tags) => t.rich('confirmation body', tags)}
                  </RichText>
                </div>
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
      </HalfCard>
    </>
  );
}

interface DeleteProfileProps {
  userId: string;
}
