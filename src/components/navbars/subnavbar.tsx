'use client';

import { User } from 'lucia';
import { Link } from 'next-view-transitions';
import { useSelectedLayoutSegment } from 'next/navigation';

export default function SubNavbar({ user, items, root }: SubNavbarProps) {
  return (
    <nav className="fixed z-30 flex max-h-10 w-full min-w-max flex-row items-center justify-between bg-background p-4 md:pl-4">
      <div className="flex flex-grow justify-start">
        {items.map((item) => (
          <>
            {(user || (!user && !item.userOnly)) && (
              <NavItem key={item.path} item={item} user={user} root={root} />
            )}
          </>
        ))}
      </div>
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
        className={`px-3 ${isActive ? 'underline underline-offset-4' : 'hover:text-foreground/70'}`}
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
  userOnly?: boolean;
  description?: string;
}
