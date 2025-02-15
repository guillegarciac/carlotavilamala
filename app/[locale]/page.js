import { projects } from "./data/projects";
import ImageGallery from "./components/ImageGallery";
import Navigation from "./components/Navigation";
import { unstable_setRequestLocale } from 'next-intl/server';

export default function Home({ params: { locale } }) {
  unstable_setRequestLocale(locale);
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="px-8 pt-24 md:pt-20 transition-opacity duration-[800ms] delay-[400ms]
        opacity-0 animate-fadeIn"
      >
        <ImageGallery 
          items={projects} 
          type="projects"
        />
      </main>
    </div>
  );
} 