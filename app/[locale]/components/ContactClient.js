"use client";

import { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import Navigation from "./Navigation";
import { Playfair_Display } from "next/font/google";
import { Toaster, toast } from 'react-hot-toast';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  weight: ['400'],
});

export default function ContactClient() {
  const formRef = useRef();
  const [sending, setSending] = useState(false);
  const t = useTranslations('contact');
  const locale = useLocale();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);

    const loadingToast = toast.loading(t('toast.loading'));

    try {
      await emailjs.sendForm(
        'service_eh5obvr', 
        'template_rfq6hgo', 
        formRef.current,
        'Edm__CzQun69SNwEG'
      );
      
      toast.success(t('toast.success'), {
        id: loadingToast,
        duration: 4000,
        style: {
          background: '#faf9f6',
          color: '#000',
          border: '1px solid #000',
        },
      });
      
      formRef.current.reset();
      
      setTimeout(() => {
        router.push(`/${locale}`);
      }, 2000);
      
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error(t('toast.error'), {
        id: loadingToast,
        duration: 4000,
        style: {
          background: '#faf9f6',
          color: '#000',
          border: '1px solid #000',
        },
      });
    }

    setSending(false);
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <Toaster 
        position="bottom-center"
        toastOptions={{
          style: {
            maxWidth: '500px',
            padding: '16px',
            fontSize: '14px',
          },
          success: {
            icon: '✓',
          },
          error: {
            icon: '✕',
          },
          loading: {
            icon: '...',
          }
        }}
      />

      <main className="px-8 mt-8 md:mt-8 pt-24 md:pt-0">
        <div className="max-w-screen-lg mx-auto">
          <h2 className={`text-base tracking-wider font-light italic mb-12 ${playfair.className}`}>
            {t('title')}
          </h2>

          <form ref={formRef} onSubmit={handleSubmit} className="max-w-2xl">
            <div className="mb-8">
              <input
                type="text"
                name="name"
                placeholder={t('form.name')}
                required
                className="w-full border-b border-black/20 py-2 px-0 text-sm 
                  bg-[#faf9f6] focus:outline-none focus:border-black/40 
                  transition-colors"
              />
            </div>

            <div className="mb-8">
              <input
                type="email"
                name="email"
                placeholder={t('form.email')}
                required
                className="w-full border-b border-black/20 py-2 px-0 text-sm 
                  bg-[#faf9f6] focus:outline-none focus:border-black/40 
                  transition-colors"
              />
            </div>

            <div className="mb-8">
              <textarea
                name="message"
                placeholder={t('form.message')}
                required
                rows={6}
                className="w-full border-b border-black/20 py-2 px-0 text-sm 
                  bg-[#faf9f6] focus:outline-none focus:border-black/40 
                  transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="border border-black px-8 py-2 text-sm hover:bg-black 
                hover:text-white transition-colors disabled:opacity-50 
                disabled:cursor-not-allowed"
            >
              {sending ? t('form.sending') : t('form.send')}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
} 