'use client';

import useDeleteClubMutation from '@/components/hooks/mutation-hooks/use-club-delete';
import { useClubInfo } from '@/components/hooks/query-hooks/use-club-info';
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  deleteClubFormSchema,
  DeleteClubFormType,
} from '@/lib/zod/delete-club-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2, Trash2 } from 'lucide-react';
import * as React from 'react';
import { useForm } from 'react-hook-form';
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
        <CardContent className="flex flex-col gap-4 px-2 sm:px-8">
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
      <CardHeader>danger zone</CardHeader>
      <CardContent className="flex flex-col gap-4 px-2 sm:px-8">
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
}

function DeleteConfirmationForm({
  className,
  id,
  userId,
}: DeleteConfirmationFormProps) {
  const queryClient = useQueryClient();
  const { data, isFetching } = useClubInfo(id);
  const clubDeleteMutation = useDeleteClubMutation(queryClient);
  const form = useForm<DeleteClubFormType>({
    resolver: zodResolver(deleteClubFormSchema),
    values: { name: '', id },
  });
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) =>
          clubDeleteMutation.mutate({ id: data.id, userId, values: data }),
        )}
        className={cn('grid items-start gap-4', className)}
        name="new-tournament-form"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={clubDeleteMutation.isPending}
                  autoComplete="off"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField control={form.control} name="id" render={() => <></>} />

        <Button
          disabled={clubDeleteMutation.isPending || isFetching || data?.name !== form.getValues().name}
          // FIXME equality check doesn;t happen on time
          className="w-full"
          variant="destructive"
        >
          {clubDeleteMutation.isPending ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Trash2 size={18} />
          )}
          &nbsp;delete club
        </Button>
      </form>
    </Form>
  );
}

// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader } from '@/components/ui/card';

// export default function ClubDelete() {
//   return (
//     <Card className="border-none shadow-none sm:border-solid sm:shadow-sm">
//       <CardHeader>danger zone</CardHeader>
//       <CardContent className="flex flex-col gap-4 px-2 sm:px-8">

//         <Button variant="destructive" className="w-full">
//           delete club
//         </Button>
//       </CardContent>
//     </Card>
//   );
// }

interface DeleteConfirmationFormProps {
  className?: string;
  id: string;
  userId: string;
}
