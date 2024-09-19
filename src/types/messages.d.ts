import en from '../messages/en.json';

type Messages = typeof en;

export function createMessages<T extends Messages>(messages: T): T {
  return messages;
}

declare global {
  interface IntlMessages extends Messages {}
}
