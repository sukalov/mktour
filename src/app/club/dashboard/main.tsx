'use client';

import { InfoItem } from '@/components/dashboard/tabs/main';
import { useUserSelectedClub } from '@/components/hooks/mutation-hooks/use-user-selected-club';
import { useClubInfo } from '@/components/hooks/query-hooks/use-club-info';
import { useUserClubs } from '@/components/hooks/query-hooks/use-user';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DatabaseClub } from '@/lib/db/schema/tournaments';
import { useQueryClient } from '@tanstack/react-query';
import { User } from 'lucia';
import { CalendarDays, Info, Loader2 } from 'lucide-react';
import { FC, useEffect, useState } from 'react';
import { toast } from 'sonner';

const Main: FC<{ clubs: DatabaseClub[]; selected: string; user: User }> = ({
  // clubs,
  // selected,
  user,
}) => {
  const [loading, setLoading] = useState(false);
  // const user = useUser()
  const clubs = useUserClubs(user.id);
  // const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate } = useUserSelectedClub(queryClient);

  useEffect(() => {
    setLoading(false);
  }, [clubs]);

  const handleChange = (clubId: string) => {
    if (user.selected_club !== clubId) {
      setLoading(true);
      // handleClubSelect(clubId, user.id);
      mutate({ id: user.id, values: { selected_club: clubId } });
      // router.refresh();
    }
  };

  
  if (clubs.isError) return toast.error('not found');
  if (clubs.status === 'pending') return 'srenk';
  // const selectedClub =
  //   clubs.data.find((club) => club.id === selected) || clubs.data[0];


  return (
    <div className="flex w-full flex-col gap-2">
      <ClubSelect
        clubs={clubs?.data}
        selectedClub={user.selected_club}
        handleChange={handleChange}
      />
      <ClubInfo user={user} loading={loading} />
    </div>
  );
};

const ClubInfo: FC<{ user: User ; loading: boolean }> = ({
  user,
  loading,
}) => {
  const selectedClub = useClubInfo(user.selected_club)

  if (!selectedClub.data) return 'aaaaaa'
  const createdAt = selectedClub.data.created_at?.toLocaleDateString(['en-GB'], {
    dateStyle: 'medium',
  });

  if (loading)
    return <Loader2 className="mt-[25%] h-16 w-16 animate-spin self-center" />;
  return (
    <Card className="items-left flex w-full flex-col gap-8 p-4">
      {selectedClub.data.description && (
        <InfoItem icon={<Info />} value={selectedClub.data.description} />
      )}
      <InfoItem icon={<CalendarDays />} value={createdAt} />
    </Card>
  );
};

const ClubSelect: FC<ClubSelectProps> = ({
  clubs,
  selectedClub,
  handleChange,
}) => {
  if (!clubs) return 'oooooooh nooooo'
  const sortedClubs = [...clubs].sort((a, b) =>
    a.id === selectedClub ? -1 : b.id === selectedClub ? 1 : 0,
  );

  const placeholder = clubs.find(club => club.id === selectedClub)?.name

  // if (!selectedClub) 

  return (
    <Select onValueChange={(newValue) => handleChange(newValue)}>
      <SelectTrigger style={{ border: 'none' }} className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>{sortedClubs.map(SelectItemIteratee)}</SelectContent>
    </Select>
  );
};

const SelectItemIteratee = (props: ClubSelectProps['clubs'][0]) => {
  return <SelectItem value={props.id!}>{props.name!}</SelectItem>;
};

type ClubSelectProps = {
  clubs: { id: string | null, name: string | null }[];
  selectedClub: string;
  handleChange: (_arg: string) => void;
};

export default Main;
