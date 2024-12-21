import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';

export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid
  if (!['en', 'es', 'ca'].includes(locale)) notFound();

  return {
    messages: (await import(`./messages/${locale}.json`)).default
  };
}); 