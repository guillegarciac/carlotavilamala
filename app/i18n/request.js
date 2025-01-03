import {getRequestConfig} from 'next-intl/server';
import {locales, defaultLocale} from './config';

export default getRequestConfig(async ({locale}) => ({
  messages: (await import(`../../messages/${locale}.json`)).default,
  timeZone: 'Europe/Madrid',
  now: new Date(),
  locales,
  defaultLocale
})); 