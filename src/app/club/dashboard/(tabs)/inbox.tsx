'use client';

import Empty from '@/components/empty';
import { useTranslations } from 'next-intl';

const ClubInbox = () => {
  const t = useTranslations('Empty');
  return <Empty>{t('inbox')}</Empty>;
};

export default ClubInbox;
