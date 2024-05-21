'use client';

import { LocaleContext, LocaleProps } from '@/components/locale-context';
import {
  createElement as $,
  FC,
  PropsWithChildren,
  useState
} from 'react';
import { IntlProvider as ReactIntlProvider } from 'react-intl';
import en from 'src/components/lang/en.json';
import ru from 'src/components/lang/ru.json';

const messages = { ru, en };

const IntlProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const [locale, setLocale] = useState<LocaleProps['locale']>('en')
  
  return $(LocaleContext.Provider,
    { value: { locale, setLocale }},
    $(ReactIntlProvider, {
      defaultLocale: locale,
      locale,
      messages: messages[locale],
      children,
    }),
  );
};

export default IntlProvider;
