import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { Playfair_Display } from "next/font/google";
import { unstable_setRequestLocale } from 'next-intl/server';
import "../globals.css";
import Footer from './components/Footer';
import { GalleryProvider } from './context/GalleryContext';

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
        <meta 
          name="viewport" 
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
      </head>
      <body className={`${playfair.className} antialiased`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <GalleryProvider>
            {children}
            <Footer />
          </GalleryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

export function generateMetadata({ params: { locale } }) {
  const baseUrl = 'https://carlotavilamala.com';
  const timestamp = Date.now();
  const url = `${baseUrl}/${locale}?v=${timestamp}`;
  const imageUrl = `/og-image.jpg?v=${timestamp}`;

  return {
    title: "Carlota Vilamala",
    description: "Fashion Stylist and Creative Direction",
    metadataBase: new URL(baseUrl),
    openGraph: {
      title: 'Carlota Vilamala',
      description: 'Fashion Stylist and Creative Direction',
      url: url,
      type: 'website',
      images: [
        {
          url: imageUrl,
        },
      ],
      updated_time: timestamp.toString(),
    },
    twitter: {
      card: 'summary_large_image',
      domain: 'carlotavilamala.com',
      title: 'Carlota Vilamala',
      description: 'Fashion Stylist and Creative Direction',
      url: url,
      images: [imageUrl],
    },
  };
}

export function generateStaticParams() {
  return ['en', 'es', 'ca'].map((locale) => ({ locale }));
}
