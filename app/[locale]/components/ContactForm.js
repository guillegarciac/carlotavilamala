"use client";

import { useTranslations } from 'next-intl';

export default function ContactForm() {
  const t = useTranslations('contact');

  return (
    <form className="w-full max-w-lg">
      <div className="mb-6">
        <input
          type="text"
          className="w-full px-3 py-2 border-b bg-transparent border-primary/input text-primary 
            placeholder:text-primary/50 focus:outline-none focus:border-accent"
          placeholder={t('name')}
          required
        />
      </div>
      
      <div className="mb-6">
        <input
          type="email"
          className="w-full px-3 py-2 border-b bg-transparent border-primary/input text-primary 
            placeholder:text-primary/50 focus:outline-none focus:border-accent"
          placeholder={t('email')}
          required
        />
      </div>
      
      <div className="mb-6">
        <textarea
          className="w-full px-3 py-2 border-b bg-transparent border-primary/input text-primary 
            placeholder:text-primary/50 focus:outline-none focus:border-accent resize-none"
          rows="4"
          placeholder={t('message')}
          required
        />
      </div>
      
      <button
        type="submit"
        className="px-8 py-2 bg-transparent border border-primary/input text-primary 
          hover:bg-accent hover:border-accent hover:text-white transition-colors"
      >
        {t('send')}
      </button>
    </form>
  );
} 