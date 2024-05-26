import { aboutNavbarItems } from '@/components/navbars/about-navbar-items';
import SubNavbar from '@/components/navbars/subnavbar';
import { validateRequest } from '@/lib/auth/lucia';
import type { ReactNode } from 'react';

export default async function AboutPageLayout({
  children,
}: ClubsPageLayoutProps) {
  const { user } = await validateRequest();
  return (
    <div>
      <SubNavbar
        user={user}
        items={aboutNavbarItems}
        root="/about/"
      />
      <div className="pt-12">{children}</div>
    </div>
  );
}

interface ClubsPageLayoutProps {
  children: ReactNode;
}
