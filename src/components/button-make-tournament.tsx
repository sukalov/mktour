import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { Link } from 'next-view-transitions';

export default function MakeTournamentButton() {
  const t = useTranslations('Menu.Subs');
  return (
    <Link href="/tournaments/create" className="m-auto w-full">
      <Button
        className="m-auto flex h-28 min-h-28 w-full max-w-[28rem] flex-col gap-2 font-bold"
        variant="default"
      >
        <h1 className="text-2xl font-light min-[320px]:text-3xl">
          {t('make tournament')}
        </h1>
      </Button>
    </Link>
  );
}
