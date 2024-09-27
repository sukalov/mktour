'use client';

import { turboPascal } from '@/app/fonts';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useEffect } from 'react';
import { toast } from 'sonner';

export default function TeamJoinToaster() {
  const t = useTranslations('TeamJoinToaster');
  const handleCancel = () => {
    toast.success(t('user refused'));
    setTimeout(() => toast.dismiss('teamJoin'));
  };

  const handleJoin = async () => {
    setTimeout(() => toast.dismiss('teamJoin'));
    toast.promise(
      fetch('/api/join-team', {
        method: 'POST',
      }),
      {
        loading: t('adding'),
        error: t('join error'),
        success: t('joined successfuly'),
      },
    );
  };
  setTimeout(() => {
    toast(
      <div>
        <h1
          className={`${turboPascal.className} text-center text-2xl font-bold leading-8`}
        >
          {t('toast header')}
        </h1>
        <p>
          {t.rich('toast message', {
            lichess: (words) => (
              <Link
                href="https://lichess.org/team/mktour"
                className="font-semibold underline"
              >
                {words}
              </Link>
            ),
          })}
        </p>
        <br />
        <div className="flex justify-center gap-2 flex-col">
          <Button onClick={handleJoin}>{t('join team')}</Button>
          <Button variant="secondary" onClick={handleCancel}>
            {t("no join button")}
          </Button>
        </div>
      </div>,
      {
        id: 'teamJoin',
        dismissible: true,
        duration: 150000,
      },
    );
  }, 500);

  useEffect(() => {
    fetch('/api/delete-new-user-cookie', {
      method: 'GET',
      credentials: 'same-origin',
    });
  }, []);

  return <></>;
}
