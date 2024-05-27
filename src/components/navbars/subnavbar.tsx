'use client';

import { ScrollArea } from '@radix-ui/react-scroll-area';
import { User } from 'lucia';
import { LucideIcon } from 'lucide-react';
import { Link } from 'next-view-transitions';
import { useSelectedLayoutSegment } from 'next/navigation';

export default function SubNavbar({ user, items, root }: SubNavbarProps) {
  return (
    <nav className="fixed z-30 flex max-h-10 w-full min-w-max flex-row items-center justify-between bg-background p-4 pl-0">
      <ScrollArea
        className="flex w-full flex-grow justify-start"
        aria-orientation="horizontal"
      >
        {items.map((item) => (
          <>
            {(user || (!user && !item.userOnly)) && (
              <NavItem key={item.path} item={item} user={user} root={root} />
            )}
          </>
        ))}
      </ScrollArea>
    </nav>
  );
}

function NavItem({
  item,
  root,
}: {
  item: SubNavbarItem;
  user?: User | null;
  root: string;
}) {
  const selection = useSelectedLayoutSegment() ?? '';
  const isActive = item.path === selection;

  return (
    <Link href={`${root}${item.path}`} className="p-2">
      <div
        className={`px-2 ${isActive ? 'font-bold underline underline-offset-4' : 'hover:text-foreground/70'}`}
      >
        {item.title}
      </div>
    </Link>
  );
}

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
