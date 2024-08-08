'use client';

import DeleteConfirmationForm, { DeleteConfirmationFormProps } from '@/app/club/dashboard/(tabs)/club-delete-form';
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
import * as React from 'react';
import { useMediaQuery } from 'react-responsive';

export default function ClubDelete({
  id,
  userId,
}: DeleteConfirmationFormProps) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery({ minWidth: 768 });
  if (isDesktop) {
    return (
      <Card className="border-none shadow-none sm:border-solid sm:shadow-sm">
        <CardHeader>danger zone</CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">delete club</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  you&apos;re about to delete everything!
                </DialogTitle>
                <DialogDescription>
                  all players and tournaments will be deleted. if you&apos;re
                  completely sure, type the name of the club you are deleting
                </DialogDescription>
              </DialogHeader>
              <DeleteConfirmationForm id={id} userId={userId} />
              <DialogClose asChild>
                <Button variant="outline">cancel</Button>
              </DialogClose>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-none sm:border-solid sm:shadow-sm">
      <CardHeader >danger zone</CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <Button variant="destructive">delete club</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader className="text-left">
              <DrawerTitle>you&apos;re about to delete everything!</DrawerTitle>
              <DrawerDescription>
                all players and tournaments will be deleted. if you&apos;re
                completely sure, type the name of the club you are deleting
              </DrawerDescription>
            </DrawerHeader>
            <DeleteConfirmationForm id={id} userId={userId} />
            <DrawerFooter className="pt-2">
              <DrawerClose asChild>
                <Button variant="outline">cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </CardContent>
    </Card>
  );
};
