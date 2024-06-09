import useOutsideClick from '@/components/hooks/use-outside-click';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import handleClubSelect from '@/lib/actions/club-select';
import { DatabaseClub } from '@/lib/db/schema/tournaments';
import { User } from 'lucia';
import { ChevronDown, LoaderCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useRef, useState } from 'react';

const ClubSelectDrawer: FC<ClubSelectProps> = ({ clubs, user, selected }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const escapeRef = useRef(null);

  useEffect(() => {
    setLoading(false);
  }, [clubs]);

  const handleChange = (clubId: string) => {
    setOpen(false);
    if (clubId !== selected.id) {
      setLoading(true);
      handleClubSelect(clubId, user.id);
      router.refresh();
    }
  };

  useOutsideClick(() => {
    open && setOpen(false);
  }, [escapeRef]);

  const sortedClubs = [...clubs].sort((a, b) =>
    a.id === selected.id ? -1 : b.id === selected.id ? 1 : 0,
  );

  const Icon = () => {
    if (loading) return <LoaderCircle className="animate-spin" />;
    return <ChevronDown className={`${open && 'rotate-180'}`} />;
  };

  return (
    <Drawer open={open} onOpenChange={(value) => setOpen(value)}>
      <DrawerTrigger asChild>
        <Button
          ref={escapeRef}
          onClick={() => setOpen(!open)}
          style={{ backgroundColor: 'transparent' }}
          size="icon"
          disabled={loading}
          variant="ghost"
        >
          <Icon />
        </Button>
      </DrawerTrigger>
      <DrawerContent ref={escapeRef}>
        <div className="flex flex-col gap-4 p-4">
          {sortedClubs.map(({ name, id }) => (
            <div
              className={`text-md ${id === selected.id && 'underline underline-offset-4'}`}
              key={id}
              onClick={() => handleChange(id)}
            >
              {name}
            </div>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

interface ClubSelectProps {
  clubs: DatabaseClub[];
  selected: DatabaseClub;
  user: User;
}

export default ClubSelectDrawer;
