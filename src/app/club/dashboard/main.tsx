'use client';

import { InfoItem } from '@/components/dashboard/tabs/main';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import handleClubSelect from '@/lib/actions/club-select';
import { DatabaseClub } from '@/lib/db/schema/tournaments';
import { User } from 'lucia';
import { CalendarDays, Info, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useState } from 'react';

const Main: FC<{ clubs: DatabaseClub[]; selected: string; user: User }> = ({
  clubs,
  selected,
  user,
}) => {
  const [loading, setLoading] = useState(false);
  const selectedClub = clubs.find((club) => club.id === selected) || clubs[0];
  const router = useRouter();

  useEffect(() => {
    setLoading(false);
  }, [clubs]);

  const handleChange = (clubId: string) => {
    if (clubId !== selectedClub.id) {
      setLoading(true);
      handleClubSelect(clubId, user.id);
      router.refresh();
    }
  };

  return (
    <div className="flex w-full flex-col gap-2">
      <ClubSelect
        clubs={clubs}
        selectedClub={selectedClub}
        handleChange={handleChange}
      />
      <ClubInfo selectedClub={selectedClub} loading={loading} />
    </div>
  );
};

const ClubInfo: FC<{ selectedClub: DatabaseClub; loading: boolean }> = ({
  selectedClub,
  loading,
}) => {
  const createdAt = selectedClub.created_at?.toLocaleDateString(['en-GB'], {
    dateStyle: 'medium',
  });

  if (loading)
    return <Loader2 className="mt-[25%] h-16 w-16 animate-spin self-center" />;
  return (
    <Card className="items-left flex w-full flex-col gap-8 p-4">
      {selectedClub.description && (
        <InfoItem icon={<Info />} value={selectedClub.description} />
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
  const sortedClubs = [...clubs].sort((a, b) =>
    a.id === selectedClub.id ? -1 : b.id === selectedClub.id ? 1 : 0,
  );

  return (
    <Select onValueChange={(newValue) => handleChange(newValue)}>
      <SelectTrigger style={{ border: 'none' }} className="w-full">
        <SelectValue placeholder={selectedClub.name} />
      </SelectTrigger>
      <SelectContent>{sortedClubs.map(SelectItemIteratee)}</SelectContent>
    </Select>
  );
};

const SelectItemIteratee = (props: DatabaseClub) => {
  return <SelectItem value={props.id}>{props.name}</SelectItem>;
};

type ClubSelectProps = {
  clubs: DatabaseClub[];
  selectedClub: DatabaseClub;
  handleChange: (_arg: string) => void;
};

export default Main;
