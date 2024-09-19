import ru from '@/messages/ru.json';

function isIntlMessages(obj: IntlMessages): obj is IntlMessages {
  return true;
}

isIntlMessages(ru)
