import { Dispatch, SetStateAction, createContext } from 'react';

export const LocaleContext = createContext<LocaleProps>({
  locale: 'en',
  setLocale: () => null,
});

export type LocaleProps = {
  locale: 'en' | 'ru';
  setLocale: Dispatch<SetStateAction<LocaleProps['locale']>>;
};
