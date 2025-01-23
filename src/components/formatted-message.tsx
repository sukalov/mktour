'use client'

import { MessageKeys, NestedKeyOf, TranslationValues, useTranslations } from 'next-intl';
import { FC } from 'react';

const FormattedMessage: FC<{
  id: MessageKeys<IntlMessages, NestedKeyOf<IntlMessages>>;
  values?: TranslationValues;
}> = ({ id, values }) => {
  const t = useTranslations();
  return t(id, values);
};

export default FormattedMessage;
