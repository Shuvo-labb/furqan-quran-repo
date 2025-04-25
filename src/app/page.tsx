import { getChapters } from '@/lib/quran-api';
import ChaptersList from '@/components/ChaptersList';
import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Search, ArrowRight, BookMarked, Headphones, Settings } from 'lucide-react';

export default async function Home() {
  const chapters = await getChapters();
  
  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="hero-content">
              <h1 className="hero-title">
                The Holy <span className="text-gradient">Quran</span>
              </h1>
              <p className="hero-subtitle">
                Explore the sacred text with a beautiful, modern reading experience designed for 
                clarity and understanding.
              </p>
              <div className="hero-cta">
                <Link href="/surah/1" className="btn-3d btn btn-primary">
                  Start Reading
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <button className="btn btn-outline">
                  Learn More
                </button>
              </div>
            </div>

            <div className="relative hidden md:block">
              <div className="relative z-10 p-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 hover-lift">
                  <div className="mb-4 text-center">
                    <h3 className="text-lg font-bold">Al-Fatihah</h3>
                    <p className="text-sm text-gray-500">The Opening</p>
                  </div>
                  <div className="text-right arabic-text text-2xl mb-4 leading-loose">
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </div>
                  <div className="border-l-4 border-teal-500 pl-4 py-2 text-sm text-gray-600 dark:text-gray-300">
                    In the name of Allah, the Entirely Merciful, the Especially Merciful.
                  </div>
                </div>
              </div>
              <div className="absolute top-[-20px] left-[-20px] w-40 h-40 bg-teal-100 dark:bg-teal-900/20 rounded-full filter blur-3xl opacity-70 z-0"></div>
              <div className="absolute bottom-[-30px] right-[-10px] w-60 h-60 bg-purple-100 dark:bg-purple-900/20 rounded-full filter blur-3xl opacity-60 z-0"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Features</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              A thoughtfully designed reading experience with modern features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card feature-card">
              <div className="feature-icon">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="feature-title">Beautiful Reading</h3>
              <p className="feature-text">
                Clear typography and thoughtful layout make reading the Quran a delightful experience.
              </p>
            </div>

            <div className="card feature-card">
              <div className="feature-icon">
                <Headphones className="h-6 w-6" />
              </div>
              <h3 className="feature-title">Audio Recitation</h3>
              <p className="feature-text">
                Listen to beautiful recitations of verses as you read along with the text.
              </p>
            </div>

            <div className="card feature-card">
              <div className="feature-icon">
                <BookMarked className="h-6 w-6" />
              </div>
              <h3 className="feature-title">Bookmarks</h3>
              <p className="feature-text">
                Save your favorite verses and quickly return to them anytime.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Chapters Section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800/50">
        <div className="container">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-12">
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 md:mb-0">
                Chapters (Surahs)
              </h2>
              
              <div className="relative w-full md:w-auto max-w-xs">
                <input 
                  type="text"
                  placeholder="Search chapters..." 
                  className="bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-2 pl-10 text-sm w-full focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <ChaptersList chapters={chapters} />
          </div>
        </div>
      </section>
    </div>
  );
}