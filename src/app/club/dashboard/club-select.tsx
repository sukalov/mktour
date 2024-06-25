'use client';

import { useUserSelectClub } from '@/components/hooks/mutation-hooks/use-user-select-club';
import { useUser } from '@/components/hooks/query-hooks/use-user';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import getUserClubs from '@/lib/actions/user-clubs';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { User } from 'lucia';

const ClubSelect = () => {
  const user = useUser();
  if (!user.data) return <Skeleton className="h-12 w-full" />;
  return <ClubSelectContent user={user.data} />;
};

const ClubSelectContent = ({ user }: { user: User }) => {
  const { data: clubs } = useQuery({
    queryKey: ['user', 'clubs', 'all-user-clubs'],
    queryFn: () => getUserClubs({ userId: user.id }),
    staleTime: 30 * 60 * 1000,
  });

  const queryClient = useQueryClient();
  const clubSelection = useUserSelectClub(queryClient);

  const placeholder = clubs?.find(
    (club) => club.id === user.selected_club,
  )?.name;

  const sortedClubs = clubs?.sort((a, b) =>
    a.id === user.selected_club ? -1 : b.id === user.selected_club ? 1 : 0,
  );

  return (
    <Select
      onValueChange={(value) =>
        clubSelection.mutate({ values: { selected_club: value }, id: user.id })
      }
    >
      <SelectTrigger className="w-full border-0">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      {sortedClubs && (
        <SelectContent>{sortedClubs.map(SelectItemIteratee)}</SelectContent>
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
