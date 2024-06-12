'use client';

import { MediaQueryContext } from '@/components/media-query-context';
import { cn } from '@/lib/utils';
import { User } from 'lucia';
import { LucideIcon } from 'lucide-react';
import { Link } from 'next-view-transitions';
import { useSelectedLayoutSegment } from 'next/navigation';
import { useContext } from 'react';

export default function SubNavbar({ user, items, root }: SubNavbarProps) {
  const preparedItems = items.filter(
    (item) => user || (!user && !item.userOnly),
  );
  const cols = `grid-cols-${items.length}`;
  const { isMobile } = useContext(MediaQueryContext);

  return (
    <nav
      className={`cols fixed z-30 grid h-10 w-full min-w-max grid-flow-col items-center bg-muted text-sm ${cols} xs:flex xs:gap-8 xs:pl-4 flex-row gap-2 px-2`}
    >
      {preparedItems.map((item) => (
        <NavItem
          key={item.path}
          item={item}
          user={user}
          root={root}
          isMobile={isMobile}
        />
      ))}
    </nav>
  );
}

const NavItem: React.FC<{
  item: SubNavbarItem;
  user?: User | null;
  root: string;
  isMobile: boolean;
}> = ({ item, root, isMobile }) => {
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

  const Title = () => {
    const logoProps = isActive
      ? { size: 18, strokeWidth: 2.5 }
      : { size: 18, strokeWidth: 2 };

    if (!isMobile) {
      return <span className="text-sm">{item.title}</span>;
    } else return <Logo {...logoProps} />;
  };

  return (
    <Link
      href={`${root}${item.path}`}
      className={cn(`flex items-center justify-center gap-1`, style)}
    >
      <Title />
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
