import { changeClub } from '@/app/club/dashboard/change-club';
import { clubQueryClient } from '@/app/club/dashboard/prefetch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import getUserClubs from '@/lib/actions/user-clubs';
import { User } from 'lucia';

const ClubSelect = async ({ user }: { user: User }) => {
  const clubs = (await clubQueryClient.fetchQuery({
    queryKey: ['user', 'clubs', 'all-clubs'],
    queryFn: () => getUserClubs({ userId: user.id }),
  })) as { id: string | null; name: string | null }[];

  const sortedClubs = [...clubs].sort((a, b) =>
    a.id === user.selected_club ? -1 : b.id === user.selected_club ? 1 : 0,
  );

  const placeholder = clubs.find(
    (club) => club.id === user.selected_club,
  )?.name;

  return (
    <Select onValueChange={changeClub}>
      <SelectTrigger className="w-full border-0">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>{sortedClubs.map(SelectItemIteratee)}</SelectContent>
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
