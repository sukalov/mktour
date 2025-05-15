'use client';

import { useUserSelectClub } from '@/components/hooks/mutation-hooks/use-user-select-club';
import { useUserClubs } from '@/components/hooks/query-hooks/use-user-clubs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTriggerNoOutline,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useQueryClient } from '@tanstack/react-query';
import { User } from 'lucia';
import { FC } from 'react';

const ClubSelect: FC<{ user: User }> = ({ user }) => {
  const { data: clubs } = useUserClubs(user.id);
  const queryClient = useQueryClient();
  const clubSelection = useUserSelectClub(queryClient);
  const placeholder = clubs?.find((club) => club.id === user.selected_club)
    ?.name ?? <Skeleton className="h-6 w-48" />;
  const sortedClubs = clubs?.sort((a, b) =>
    a.id === user.selected_club ? -1 : b.id === user.selected_club ? 1 : 0,
  );

  return (
    <Select
      value={user.selected_club}
      onValueChange={(value) =>
        clubSelection.mutate({
          values: { selected_club: value },
          id: user.id,
        })
      }
    >
      <SelectTriggerNoOutline className="bg-background/30 w-full rounded-none px-4 backdrop-blur-md">
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
    <SelectItem key={props.id} value={props.id!}>
      {props.name!}
    </SelectItem>
  );
};

type ClubSelectProps = { id: string | null; name: string | null };

export default ClubSelect;
