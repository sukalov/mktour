'use client';

import ClubPlayersList from '@/app/club/dashboardAlt/(tabs)/club-players-list';
import ClubSettingsForm from '@/app/club/dashboardAlt/(tabs)/club-settings-form';
import ClubInbox from '@/app/club/dashboardAlt/(tabs)/inbox';
import ClubMain from '@/app/club/dashboardAlt/(tabs)/main';
import ClubDashboardTournaments from '@/app/club/dashboardAlt/(tabs)/tournaments-list';
import ClubSelect from '@/app/club/dashboardAlt/club-select';
import { useUser } from '@/components/hooks/query-hooks/use-user';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter, useSearchParams } from 'next/navigation';
import { FC, useEffect, useState } from 'react';

export default function Dashboard({ userId }: { userId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'main';
  const user = useUser(userId);
  const selectedClub = user.data?.selected_club || '';
  const [tab, setTab] = useState(initialTab);
  const ActiveTab: FC<{ userId: string; selectedClub: string }> = tabMap[tab];

  useEffect(() => {
    const newParams = new URLSearchParams(window.location.search);
    newParams.set('tab', tab);
    const newUrl = `${window.location.pathname}?${newParams.toString()}`;
    router.push(newUrl, { scroll: false });
  }, [tab, router]);

  return (
    <div>
      <TabList tab={tab} setTab={setTab} />
      <div className="pt-12">
        <div className="px-1">
          <ClubSelect userId={userId} />
        </div>
        <div className="p-2 pt-2">
          <ActiveTab userId={userId} selectedClub={selectedClub} />
        </div>
      </div>
    </div>
  );
}

const TabList: FC<any> = ({ setTab, tab }) => {
  return (
    <Tabs
      defaultValue="main"
      onValueChange={(value) => setTab(value)}
      value={tab}
      className="fixed z-40 w-full rounded-none transition-all duration-500"
    >
      <TabsList className="w-full justify-around overflow-scroll rounded-none no-scrollbar md:justify-evenly">
        {Object.keys(tabMap).map((tab) => (
          <div key={tab}>
            <TabsTrigger className="w-full" value={tab}>
              {tab}
            </TabsTrigger>
          </div>
        ))}
      </TabsList>
    </Tabs>
  );
};

const tabMap: Record<string, FC<{ userId: string; selectedClub: string }>> = {
  main: ClubMain,
  players: ClubPlayersList,
  tournaments: ClubDashboardTournaments,
  inbox: ClubInbox,
  settings: ClubSettingsForm,
};
