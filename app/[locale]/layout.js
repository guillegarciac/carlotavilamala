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
  const url = 'https://carlotavilamala.vercel.app';

  return {
    title: "Carlota Vilamala",
    description: "Portfolio & Works",
    metadataBase: new URL(url),
    openGraph: {
      title: 'Carlota Vilamala',
      description: 'Fashion Stylist & Creative Direction',
      url: url,
      siteName: 'Carlota Vilamala',
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'Carlota Vilamala - Fashion Stylist & Creative Direction',
        },
      ],
      locale: locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Carlota Vilamala',
      description: 'Fashion Stylist & Creative Direction',
      images: ['/og-image.jpg'],
    },
  };
}

export function generateStaticParams() {
  return ['en', 'es', 'ca'].map((locale) => ({ locale }));
}
