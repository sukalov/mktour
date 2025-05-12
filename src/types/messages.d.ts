import en from '@/messages/en.json';
import ru from '@/messages/ru.json';

type Messages = typeof en;
if (!(ru instanceof IntlMessages)) throw new Error('RU_TRANSLATIONS_ERROR');

declare global {
  export interface IntlMessages extends Messages {}
}
