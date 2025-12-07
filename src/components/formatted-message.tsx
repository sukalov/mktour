'use client';

import {
  MessageKeys,
  NestedKeyOf,
  TranslationValues,
  useTranslations,
} from 'next-intl';
import { FC } from 'react';

const FormattedMessage: FC<{
  id: IntlMessageId;
  values?: TranslationValues;
}> = ({ id, values }) => {
  const t = useTranslations();
  return t(id, values);
};

export type IntlMessageId = MessageKeys<
  IntlMessages,
  NestedKeyOf<IntlMessages>
>;

export default FormattedMessage;
