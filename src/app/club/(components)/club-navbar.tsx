'use client';

import {
  ClubsNavbarItem,
  clubsNavbarItems,
} from '@/app/club/(components)/club-navbar-items';
import { User } from 'lucia';
import { Link } from 'next-view-transitions';
import { useSelectedLayoutSegment } from 'next/navigation';

export default function ClubsNavbar({ user }: ClubsNavbarProps) {
  if (user) {
    return (
      <nav className="fixed z-30 flex max-h-10 w-full min-w-max flex-row items-center justify-between bg-background p-4 md:pl-4">
        <div className="flex flex-grow justify-start">
          {clubsNavbarItems.map((item) => (
            <NavItem key={item.slug} item={item} user={user} />
          ))}
        </div>
      </nav>
    );
  }
}

function NavItem({ item, user }: { item: ClubsNavbarItem; user: User | null }) {
  const selection = useSelectedLayoutSegment() ?? '';
  const isActive = item.slug === selection;
  const slug = '/club/';
  return (
    <Link href={`${slug}${item.slug}`} className="p-2">
      <div
        className={`px-3 ${isActive ? 'underline underline-offset-4' : 'hover:text-foreground/70'}`}
      >
        {item.title}
      </div>
    </Link>
  );
}

interface ClubsNavbarProps {
  user: User | null;
}
