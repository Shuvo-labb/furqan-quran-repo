import Link from 'next/link';
import { Chapter } from '@/types';
import { ArrowRight, BookMarked } from 'lucide-react';

export default function ChaptersList({ chapters }: { chapters: Chapter[] }) {
  return (
    <div className="chapters-grid">
      {chapters.map((chapter) => (
        <Link 
          key={chapter.id}
          href={`/surah/${chapter.id}`}
          className="chapter-card"
        >
          <div className="flex justify-between items-center p-4 bg-gradient-to-r from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/10">
            <div className="flex items-center justify-center rounded-full w-12 h-12 font-semibold bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-lg">
              {chapter.id}
            </div>
            <div className="badge badge-accent">
              {chapter.revelation_place === 'makkah' ? 'Makki' : 'Madani'}
            </div>
          </div>
          
          <div className="p-5 flex-1 flex flex-col">
            <div className="flex justify-between items-start mb-3">
              <h2 className="chapter-title">
                {chapter.name_simple}
                <span className="chapter-subtitle block mt-1 text-gray-500 dark:text-gray-400 font-normal">
                  {chapter.translated_name.name}
                </span>
              </h2>
              <div className="text-right">
                <span className="text-sm text-secondary block mb-1">
                  {chapter.verses_count} verses
                </span>
              </div>
            </div>
            
            <div className="arabic-text text-2xl text-right mt-3 mb-auto">
              {chapter.name_arabic}
            </div>
            
            <div className="chapter-info mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between">
              <span className="text-sm text-secondary">
                Chapter {chapter.id}
              </span>
              <span className="inline-flex items-center text-teal-600 dark:text-teal-400 text-sm font-medium transition-transform group">
                Read
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}