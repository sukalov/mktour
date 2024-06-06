'use client';

import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { User } from 'lucia';
import { LucideIcon } from 'lucide-react';
import { Link } from 'next-view-transitions';
import { useSelectedLayoutSegment } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

export default function SubNavbar({ user, items, root }: SubNavbarProps) {
  const [showTitles, setShowTitles] = useState(true);
  const preparedItems = items.filter(
    (item) => user || (!user && !item.userOnly),
  );
  const cols = `grid-cols-${items.length}`;
  const isMobile = useMediaQuery({ maxWidth: 640 });
  useEffect(() => {
    if (isMobile) setShowTitles(false);
    else setShowTitles(true);
  }, [isMobile]);
  return (
    <nav
      className={`cols fixed z-30 grid h-10 w-full min-w-max grid-flow-col items-center bg-muted text-sm ${cols} flex-row gap-2 px-2 xs:flex xs:gap-8 xs:pl-4`}
    >
      {preparedItems.map((item) => (
        <NavItem
          key={item.path}
          item={item}
          user={user}
          root={root}
          showTitles={showTitles}
        />
      ))}
    </nav>
  );
}

const NavItem: React.FC<{
  item: SubNavbarItem;
  user?: User | null;
  root: string;
  showTitles: boolean;
}> = ({ item, root, showTitles }) => {
  const selection = useSelectedLayoutSegment() ?? '';
  const isActive = item.path === selection;
  const style = isActive
    ? 'bg-background py-1.5 px-2 rounded-sm shadow-sm'
    : 'text-foreground/60 px-2 hover:text-foreground';
  const Logo = (props: LogoProps) =>
    item.logo && (
      <item.logo
        size={props.size}
        strokeWidth={props.strokeWidth}
        className={props.className}
      />
    );

  return (
    <Link href={`${root}${item.path}`}>
      <div className={cn(`flex items-center justify-center gap-1`, style)}>
        {showTitles ? (
          <Label className="text-sm">{item.title}</Label>
        ) : isActive ? (
          <Logo size={18} strokeWidth={2.5} />
        ) : (
          <Logo size={18} strokeWidth={2} />
        )}
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

interface LogoProps {
  size: number;
  strokeWidth: number;
  className?: string;
}
