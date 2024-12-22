"use client";

import { useRef, useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import Navigation from "./Navigation";
import { Playfair_Display } from "next/font/google";
import { Toaster, toast } from 'react-hot-toast';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { IoSend } from "react-icons/io5";

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
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    // Hide footer when contact page is mounted
    const footer = document.querySelector('footer');
    if (footer) {
      footer.style.display = 'none';
    }
    
    // Show footer when component unmounts
    return () => {
      if (footer) {
        footer.style.display = 'block';
      }
    };
  }, []);

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

  const checkFormValidity = () => {
    const nameInput = formRef.current?.['name'];
    const emailInput = formRef.current?.['email'];
    const messageInput = formRef.current?.['message'];
    
    const isValid = 
      nameInput?.value.trim() !== '' && 
      emailInput?.value.trim() !== '' && 
      messageInput?.value.trim() !== '' &&
      emailInput?.validity.valid;
    
    setIsFormValid(isValid);
  };

  return (
    <div className="h-screen fixed inset-0 overflow-hidden">
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

      <main className="px-8 pt-20 md:pt-20 h-[calc(100vh-80px)] flex flex-col overflow-hidden">
        <div>
          <h2 className={`text-base tracking-wider font-light italic mb-12 ${playfair.className}`}>
            {t('title')}
          </h2>

          <form 
            ref={formRef} 
            onSubmit={handleSubmit} 
            id="contact-form"
            className="flex flex-col h-[calc(100vh-240px)]"
            onChange={checkFormValidity}
          >
            <div className="mb-8">
              <input
                type="text"
                name="name"
                placeholder={t('form.name')}
                required
                className="w-full border-b border-black/20 py-3 px-0 text-base 
                  bg-[#faf9f6] focus:outline-none focus:border-black/40 
                  transition-colors touch-manipulation"
              />
            </div>

            <div className="mb-8">
              <input
                type="email"
                name="email"
                placeholder={t('form.email')}
                required
                className="w-full border-b border-black/20 py-3 px-0 text-base 
                  bg-[#faf9f6] focus:outline-none focus:border-black/40 
                  transition-colors touch-manipulation"
              />
            </div>

            <div className="flex-1 min-h-0">
              <textarea
                name="message"
                placeholder={t('form.message')}
                required
                className="w-full h-full border-b border-black/20 py-3 px-0 text-base 
                  bg-[#faf9f6] focus:outline-none focus:border-black/40 
                  transition-colors resize-none touch-manipulation"
              />
            </div>
          </form>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#faf9f6] border-t">
          <button
            type="submit"
            form="contact-form"
            disabled={sending}
            className={`w-full py-3 transition-all text-sm flex items-center justify-center gap-2
              ${isFormValid 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-[#faf9f6] border border-black hover:bg-black hover:text-white'
              } 
              disabled:opacity-50`}
          >
            <IoSend className="text-base" />
            {sending ? t('form.sending') : t('form.send')}
          </button>
        </div>
      </main>
    </div>
  );
} 