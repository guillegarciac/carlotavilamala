export const defaultLocale = 'en';
export const locales = ['en', 'es'];

export function getLocaleFromPathname(pathname) {
  const segments = pathname.split('/');
  const locale = segments[1];
  return locales.includes(locale) ? locale : defaultLocale;
} 