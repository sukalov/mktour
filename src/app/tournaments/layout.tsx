import type { ReactNode } from 'react';

export default async function TournamentsPageLayout({
  children,
}: ClubsPageLayoutProps) {
  // const { user } = await validateRequest();
  // const tournamentsNavbarFixed = TOURNAMENTS_NAVBAR_ITEMS.map((el) => ({
  //   ...el,
  //   path: String(el.path.split('/').at(-1)),
  // }));
  return (
    <div>
      {/* <SubNavbar
        user={user}
        items={tournamentsNavbarFixed}
        root="/tournaments/"
      /> */}
      {/* <div className="pt-12">{children}</div> */}
      {children}
    </div>
  );
}

interface ClubsPageLayoutProps {
  children: ReactNode;
}
