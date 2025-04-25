// src/components/VerseItem.tsx
'use client';
import { useState } from 'react';
import BookmarkButton from './BookmarkButton';
import AudioPlayer from './AudioPlayer';
import { Verse } from '@/types';
import { useFontSettings } from '@/providers/FontSettingsProvider';
import { Share2, Copy, MessageCircle } from 'lucide-react';

interface VerseItemProps {
  verse: Verse;
}

export default function VerseItem({ verse }: VerseItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { fontSizes } = useFontSettings();
  
  // Get audio URL with proper type checking and structure validation
  const audioUrl = verse.audio && typeof verse.audio === 'object' 
    ? verse.audio.primary 
    : (typeof verse.audio === 'string' ? verse.audio : '');

  // Generate an alternative audio URL if the primary one is not available
  const getAlternativeAudioUrl = (): string => {
    // Format: https://cdn.islamic.network/quran/audio/128/ar.alafasy/1_1.mp3
    // Where 1_1 is chapter_verse
    return `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${verse.chapter_id}_${verse.verse_number}.mp3`;
  };
  
  // Use the original URL if available, otherwise use the alternative
  const finalAudioUrl = audioUrl && audioUrl.trim() !== '' ? audioUrl : getAlternativeAudioUrl();

  return (
    <div 
      className="verse-container hover:bg-gray-50 dark:hover:bg-gray-800/30 rounded-lg my-4 transition-all"
      id={`verse-${verse.verse_number}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-start gap-4">
        <div className="verse-number flex-shrink-0">
          {verse.verse_number}
        </div>
        <div className="flex-1">
          <p 
            className={`verse-text arabic-text ${fontSizes.arabicText} text-right mb-6 leading-loose tracking-normal`} 
            style={{ textAlignLast: 'right', direction: 'rtl' }}
          >
            {verse.text_uthmani}
          </p>
          {verse.translation && (
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <p className={`verse-translation ${fontSizes.englishText}`}>
                {verse.translation}
              </p>
            </div>
          )}
        </div>
      </div>
      
      <div className={`verse-actions transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-60'}`}>
        <div className="flex flex-wrap gap-3 justify-end">
          <button className="icon-btn hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
            <Share2 className="h-5 w-5" />
          </button>
          <BookmarkButton verseKey={`${verse.chapter_id}:${verse.verse_number}`} />
          <AudioPlayer audioUrl={finalAudioUrl} />
          <button className="icon-btn hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
            <Copy className="h-5 w-5" />
          </button>
          <button className="icon-btn hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
            <MessageCircle className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}