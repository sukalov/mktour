'use client';

import { DashboardContext } from '@/app/tournaments/[id]/dashboard/dashboard-context';
import useTournamentReset from '@/components/hooks/mutation-hooks/use-tournament-reset';
import { Button } from '@/components/ui/button';
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
import { useQueryClient } from '@tanstack/react-query';
import { CircleX, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import * as React from 'react';
import { useMediaQuery } from 'react-responsive';

export default function ResetTournamentButton() {
  const { id: tournamentId } = useParams<{ id: string }>();
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery({ minWidth: 768 });
  const t = useTranslations('Tournament.Main');
  const queryClient = useQueryClient();
  const { sendJsonMessage, setRoundInView } =
    React.useContext(DashboardContext);
  const { mutate, isPending } = useTournamentReset(
    tournamentId,
    queryClient,
    sendJsonMessage,
    setRoundInView,
  );
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="destructive">
            <CircleX />
            &nbsp;{t('reset progress')}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('confirmation header')}</DialogTitle>
            <DialogDescription>{t.rich('confirmation body')}</DialogDescription>
          </DialogHeader>
          <Button
            variant={'destructive'}
            onClick={() => mutate({ tournamentId })}
            disabled={isPending}
          >
            {isPending ? <Loader2 className="animate-spin" /> : <CircleX />}
            &nbsp;
            {t('confirm reset')}
          </Button>
          <DialogClose asChild>
            <Button variant="outline">{t('cancel')}</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="destructive">
          <CircleX />
          &nbsp;{t('reset progress')}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{t('confirmation header')}</DrawerTitle>
          <DrawerDescription>{t.rich('confirmation body')}</DrawerDescription>
        </DrawerHeader>
        <div className="w-full px-4">
          <Button
            variant={'destructive'}
            className="w-full"
            onClick={() => mutate({ tournamentId })}
            disabled={isPending}
          >
            {isPending ? <Loader2 className="animate-spin" /> : <CircleX />}
            &nbsp;
            {t('confirm reset')}
          </Button>
        </div>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">{t('cancel')}</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
