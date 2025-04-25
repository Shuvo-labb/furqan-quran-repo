// src/app/surah/[id]/page.tsx
import { getChapter, getVerses } from '@/lib/quran-api';
import ChapterHeader from '@/components/ChapterHeader';
import VerseItem from '@/components/VerseItem';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Search, Share2, BookMarked, Settings } from 'lucide-react';

export default async function SurahPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  if (!params.id || isNaN(Number(params.id))) {
    notFound();
  }

  try {
    const [chapter, verses] = await Promise.all([
      getChapter(Number(params.id)),
      getVerses(Number(params.id))
    ]);

    // Verify that we have valid data
    if (!chapter || Object.keys(chapter).length === 0) {
      throw new Error('Failed to load chapter data');
    }

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
        <div className="container mx-auto px-4 pt-8">
          <div className="mb-6 flex items-center justify-between">
            <Link 
              href="/" 
              className="inline-flex items-center px-4 py-2 bg-teal-600 hover:bg-teal-700 rounded-lg text-white font-medium transition-all duration-200 shadow-sm hover:shadow group"
            >
              <ArrowLeft className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
              Back to Chapters
            </Link>
            
            <div className="flex items-center gap-3">
              <button className="icon-btn hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full p-2" title="Share">
                <Share2 className="h-5 w-5" />
              </button>
              <button className="icon-btn hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full p-2" title="Bookmark chapter">
                <BookMarked className="h-5 w-5" />
              </button>
              <button className="icon-btn hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full p-2" title="Settings">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>

          <ChapterHeader chapter={chapter} />
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            {verses && verses.length > 0 ? (
              <div>
                <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Verses</h2>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <input 
                        type="text"
                        placeholder="Find verse..." 
                        className="bg-white dark:bg-gray-800 rounded-full px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 border border-gray-200 dark:border-gray-700 transition-all duration-300 w-48 focus:w-64 shadow-sm"
                      />
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-teal-500" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-teal-500 text-white text-xs font-medium">
                        {verses.length}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 text-sm">Verses</span>
                    </div>
                  </div>
                </div>
                
                <div className="px-4 py-2">
                  {verses.map((verse) => (
                    <VerseItem key={verse.id} verse={verse} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-gray-500 dark:text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-xl mb-2 font-medium">No verses found</p>
                <p>Please try refreshing the page.</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="mt-4 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Refresh Page
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error(`Error loading Surah ${params.id}:`, error);
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-lg w-full text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Unable to load Surah</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">There was an error loading this surah. Please try again later or check your connection.</p>
          <div className="flex justify-center space-x-4">
            <Link 
              href="/" 
              className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded-lg transition-colors"
            >
              Return Home
            </Link>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }
}