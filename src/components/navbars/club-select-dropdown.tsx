import useOutsideClick from '@/components/hooks/use-outside-click';
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
import { FC, useEffect, useRef, useState } from 'react';

const ClubDropdownSelect: FC<ClubSelectProps> = ({ clubs, user, selected }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);

  useEffect(() => {
    setLoading(false);
  }, [clubs]);

  const handleChange = (clubId: string) => {
    if (clubId !== selected.id) {
      setLoading(true);
      handleClubSelect(clubId, user.id);
      router.refresh();
    }
  };

  useOutsideClick(() => {
    open && setOpen(false);
  }, [buttonRef]);

  const sortedClubs = [...clubs].sort((a, b) =>
    a.id === selected.id ? -1 : b.id === selected.id ? 1 : 0,
  );

  const Icon = () => {
    if (loading) return <LoaderCircle className="animate-spin" />;
    return <ChevronDown className={`${open && 'rotate-180'}`} />;
  };

  return (
    <DropdownMenu open={open} modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          ref={buttonRef}
          onClick={() => setOpen(!open)}
          style={{ backgroundColor: 'transparent' }}
          size="icon"
          disabled={loading}
          variant="ghost"
        >
          <Icon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="shadow-black-500 mt-2 h-[100vh] w-[100vw] flex-col rounded-none bg-muted p-2 shadow-2xl">
        {/* FIXME find better way to scroll overflow content: */}
        <DropdownMenuGroup className="h-full overflow-scroll pb-[70%]">
          {sortedClubs.map(({ name, id }) => (
            <DropdownMenuCheckboxItem
              className="text-md"
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
