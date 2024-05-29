'use client';

import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { User } from 'lucia';
import { LucideIcon } from 'lucide-react';
import { Link } from 'next-view-transitions';
import { useSelectedLayoutSegment } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

export default function BottomNavigation({
  user,
  items,
  root,
}: SubNavbarProps) {
  const [showTitles, setShowTitles] = useState(true);
  const preparedItems = items.filter(
    (item) => user || (!user && !item.userOnly),
  );
  const cols = `grid-cols-${items.length}`;
  const isMobile = useMediaQuery({ maxWidth: 500 });
  useEffect(() => {
    if (isMobile) setShowTitles(false);
    else setShowTitles(true);
  }, [isMobile]);
  const arrangement = isMobile
    ? `grid grid-flow-row ${cols} px-2`
    : 'flex flex-row gap-8 pl-2 w-full';
  return (
    <nav
      className={`cols fixed z-30 h-12 w-full min-w-max bg-muted text-sm ${arrangement}`}
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
    ? 'underline underline-offset-4 font-bold text-lg'
    : 'hover:text-foreground/60';
  const Logo = (props: LogoProps) =>
    item.logo && (
      <item.logo size={props.size} strokeWidth={props.strokeWidth} className={props.className} />
    );

  return (
    <Link href={`${root}${item.path}`}>
      <div
        className={cn(
          `flex h-full flex-col items-center justify-center gap-1 transition-all duration-300`,
          style,
        )}
      >
        {showTitles ? (
          <Label className="text-sm">{item.title}</Label>
        ) : isActive ? (
          <Logo size={21} strokeWidth={3} className='underline underline-offset-4'/>
        ) : (
          <Logo size={20} strokeWidth={2} />
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
