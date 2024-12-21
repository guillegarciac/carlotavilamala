import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'es', 'ca'],
  defaultLocale: 'ca',
});

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
}; 