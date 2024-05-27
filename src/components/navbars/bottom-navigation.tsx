'use client';

import { Label } from '@/components/ui/label';
import { User } from 'lucia';
import { LucideIcon } from 'lucide-react';
import { Link } from 'next-view-transitions';
import { useSelectedLayoutSegment } from 'next/navigation';

export default function BottomNavigation({
  user,
  items,
  root,
}: SubNavbarProps) {
  const preparedItems = items.filter(
    (item) => user || (!user && !item.userOnly),
  );
  return (
    <nav className="fixed bottom-4 left-0 right-0 mx-4 flex justify-between">
      {preparedItems.map((item) => (
        <NavItem key={item.path} item={item} user={user} root={root} />
      ))}
    </nav>
  );
}

const NavItem: React.FC<{
  item: SubNavbarItem;
  user?: User | null;
  root: string;
}> = ({ item, root }) => {
  const selection = useSelectedLayoutSegment() ?? '';
  const isActive = item.path === selection;
  const style = isActive
    ? 'font-bold underline underline-offset-4 translate-y-[-8px] scale-110'
    : 'hover:text-foreground/70';
  const Logo = () => item.logo && <item.logo />;

  return (
    <Link href={`${root}${item.path}`}>
      <div
        className={`flex flex-col items-center justify-center gap-2 ${style} transition-all duration-300`}
      >
        <Logo />
        <Label style={{ fontSize: '12px' }}>{item.title}</Label>
      </div>
    </Link>
  );
};

interface SubNavbarProps {
  user: User | null;
  items: SubNavbarItem[];
  root: string;
}

export interface SubNavbarItem {
  title: string;
  path: string;
  logo?: LucideIcon;
  userOnly?: boolean;
  description?: string;
}
