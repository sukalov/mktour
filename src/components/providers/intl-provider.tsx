'use client';

import { AbstractIntlMessages, NextIntlClientProvider } from 'next-intl';
import { ReactNode } from 'react';

const IntlProvider = ({
  children,
  ...props
}: {
  children: ReactNode;
  messages: AbstractIntlMessages;
  locale: string;
}) => {
  return (
    <NextIntlClientProvider
      locale={props.locale}
      messages={props.messages}
      defaultTranslationValues={{
        bold: (args) => <span className="font-bold">{args}</span>,
      }}
      now={new Date()}
      timeZone={Intl.DateTimeFormat().resolvedOptions().timeZone}
    >
      {children}
    </NextIntlClientProvider>
  );
};

export default IntlProvider;
