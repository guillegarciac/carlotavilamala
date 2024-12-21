import ContactClient from '../components/ContactClient';
import { unstable_setRequestLocale } from 'next-intl/server';

export default function Contact({ params: { locale } }) {
  unstable_setRequestLocale(locale);
  return <ContactClient />;
} 