import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { Playfair_Display } from "next/font/google";
import { unstable_setRequestLocale } from 'next-intl/server';
import "../globals.css";
import Footer from './components/Footer';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400'],
});

export default async function LocaleLayout({ children, params: { locale } }) {
  unstable_setRequestLocale(locale);

  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <html lang={locale}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <title>Carlota Vilamala</title>
        <meta name="description" content="Portfolio & Works" />
      </head>
      <body className={`${playfair.className} antialiased min-h-screen flex flex-col`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

export function generateMetadata({ params: { locale } }) {
  return {
    title: "Carlota Vilamala",
    description: "Portfolio & Works",
  };
}

export function generateStaticParams() {
  return ['en', 'es', 'ca'].map((locale) => ({ locale }));
}
