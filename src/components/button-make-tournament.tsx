import { Button } from '@/components/ui/button';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

// import { Link } from 'next-view-transitions';

export default async function MakeTournamentButton() {
  const t = await getTranslations();
  return (
    <Button
      className="m-auto flex h-28 min-h-28 w-full max-w-md flex-col gap-2 font-bold"
      variant="default"
      asChild
    >
      <Link href="/tournaments/create" className="m-auto w-full">
        <span className="text-2xl font-light min-[320px]:text-3xl">
          {t('Home.make tournament')}
        </span>
      </Link>
    </Button>
  );
}
