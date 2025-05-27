'use client';

import { useUserSelectClub } from '@/components/hooks/mutation-hooks/use-user-select-club';
import { useAuthClubs } from '@/components/hooks/query-hooks/use-user-clubs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTriggerNoOutline,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { DatabaseUser } from '@/server/db/schema/users';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { FC } from 'react';
import { toast } from 'sonner';

const ClubSelect: FC<{ user: DatabaseUser }> = ({ user }) => {
  const { data: clubs, status } = useAuthClubs();
  const queryClient = useQueryClient();
  const clubSelection = useUserSelectClub(queryClient);
  const t = useTranslations('Toasts');
  if (status === 'error')
    toast.error(t('server error'), {
      id: 'error',
      duration: 3000,
    });
  if (status !== 'success') return <SelectSkeleton />;
  const placeholder = clubs.find((club) => club.id === user.selected_club)
    ?.name ?? <SelectSkeleton />;
  const sortedClubs = clubs.sort((a, b) =>
    a.id === user.selected_club ? -1 : b.id === user.selected_club ? 1 : 0,
  );

  return (
    <Select
      value={user.selected_club}
      onValueChange={(value) =>
        clubSelection.mutate({
          clubId: value,
          userId: user.id,
        })
      }
    >
      <SelectTriggerNoOutline className="bg-background/30 w-full rounded-none px-6 backdrop-blur-md">
        <SelectValue placeholder={placeholder} />
      </SelectTriggerNoOutline>
      {sortedClubs && (
        <SelectContent position="popper" collisionPadding={0} className="-mt-1">
          {sortedClubs.map(SelectItemIteratee)}
        </SelectContent>
      )}
    </Select>
  );
};

const SelectItemIteratee = (props: ClubSelectProps) => {
  return (
    <SelectItem key={props.id} value={props.id}>
      {props.name}
    </SelectItem>
  );
};
const SelectSkeleton = () => (
  <div className="h-8 w-full px-5 pt-3 pb-1">
    <Skeleton className="h-full w-full" />
  </div>
);

type ClubSelectProps = { id: string; name: string };

export default ClubSelect;
