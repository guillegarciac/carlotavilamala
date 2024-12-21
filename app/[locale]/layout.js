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
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://carlotavilamala.vercel.app/" />
        <meta property="og:title" content="Carlota Vilamala" />
        <meta property="og:description" content="Fashion Stylist & Creative Direction" />
        <meta property="og:image" content="https://carlotavilamala.vercel.app/og-image.jpg" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://carlotavilamala.vercel.app/" />
        <meta property="twitter:title" content="Carlota Vilamala" />
        <meta property="twitter:description" content="Fashion Stylist & Creative Direction" />
        <meta property="twitter:image" content="https://carlotavilamala.vercel.app/og-image.jpg" />
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
