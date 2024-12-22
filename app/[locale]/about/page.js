import AboutClient from '../components/AboutClient';
import { unstable_setRequestLocale } from 'next-intl/server';

export default function About({ params: { locale } }) {
  unstable_setRequestLocale(locale);

  return <AboutClient />;
} 