'use client'

import { MessageKeys, NestedKeyOf, useTranslations } from 'next-intl';
import { FC } from 'react';

const FormattedMessage: FC<{
  id: MessageKeys<IntlMessages, NestedKeyOf<IntlMessages>>;
}> = ({ id }) => {
  const t = useTranslations();
  return t(id);
};

export default FormattedMessage;
