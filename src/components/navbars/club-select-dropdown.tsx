import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import handleClubSelect from '@/lib/actions/club-select';
import { DatabaseClub } from '@/lib/db/schema/tournaments';
import { User } from 'lucia';
import { ChevronDown, LoaderCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useState } from 'react';

const ClubDropdownSelect: FC<ClubSelectProps> = ({ clubs, user, selected }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, [clubs]);

  const handleChange = (clubId: string) => {
    setLoading(true);
    handleClubSelect(clubId, user.id);
    router.refresh();
  };

  const sortedClubs = [...clubs].sort((a, b) =>
    a.id === selected.id ? -1 : b.id === selected.id ? 1 : 0,
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" disabled={loading} variant="ghost">
          {loading ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            <ChevronDown />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="shadow-black-500 mt-2 h-[100vh] w-[100vw] rounded-none bg-muted p-2 shadow-2xl">
        <DropdownMenuGroup>
          {sortedClubs.map(({ name, id }) => (
            <DropdownMenuCheckboxItem
              key={id}
              checked={id === selected.id}
              onCheckedChange={() => handleChange(id)}
            >
              {name}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

interface ClubSelectProps {
  clubs: DatabaseClub[];
  selected: DatabaseClub;
  user: User;
}

export default ClubDropdownSelect;
