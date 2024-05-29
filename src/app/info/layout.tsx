import type { ReactNode } from 'react';

export default async function AboutPageLayout({
  children,
}: ClubsPageLayoutProps) {
  return <div>{children}</div>;
}

interface ClubsPageLayoutProps {
  children: ReactNode;
}
