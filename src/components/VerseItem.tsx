// src/components/VerseItem.tsx
'use client';
import { useState, useEffect } from 'react';
import BookmarkButton from './BookmarkButton';
import { Verse } from '@/types';
import { useFontSettings } from '@/providers/FontSettingsProvider';
import { Share2, Copy, Play, Pause } from 'lucide-react';

// Create a global audio state manager to ensure only one audio plays at a time
// This object will be shared across all VerseItem components
const audioManager = {
  currentAudio: null as HTMLAudioElement | null,
  currentVerseId: null as string | null,
  setCurrentAudio(audio: HTMLAudioElement | null, verseId: string | null) {
    // Stop the previous audio if it exists
    if (this.currentAudio && this.currentAudio !== audio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
    }
    this.currentAudio = audio;
    this.currentVerseId = verseId;
  },
  isPlaying(verseId: string): boolean {
    return this.currentVerseId === verseId && this.currentAudio !== null && !this.currentAudio.paused;
  },
};

interface VerseItemProps {
  verse: Verse;
}

export default function VerseItem({ verse }: VerseItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { fontSizes } = useFontSettings();
  
  // Generate a unique verse identifier
  const verseId = `${verse?.chapter_id || ''}:${verse?.verse_number || ''}`;
  
  // Check if this verse's audio is playing when the component mounts or when audioManager changes
  useEffect(() => {
    // Update the playing state based on the audio manager
    const updatePlayingState = () => {
      setIsPlaying(audioManager.isPlaying(verseId));
    };
    
    // Call once on mount
    updatePlayingState();
    
    // Setup interval to regularly check playing state
    const interval = setInterval(updatePlayingState, 500);
    
    // Clean up on unmount
    return () => {
      clearInterval(interval);
    };
  }, [verseId]);
  
  // Function to copy verse content to clipboard
  const handleCopy = async () => {
    const verseContent = `${verse.text_uthmani}\n\n${verse.translation || ''}`;
    try {
      await navigator.clipboard.writeText(verseContent);
      setCopyFeedback('Copied!');
      setTimeout(() => setCopyFeedback(null), 2000);
    } catch (error) {
      console.error('Failed to copy text: ', error);
      setCopyFeedback('Failed to copy');
      setTimeout(() => setCopyFeedback(null), 2000);
    }
  };

  // Function to share verse content
  const handleShare = async () => {
    const verseContent = `${verse.text_uthmani}\n\n${verse.translation || ''}`;
    const shareData = {
      title: `Verse ${verse.chapter_id}:${verse.verse_number}`,
      text: verseContent,
      url: `${window.location.origin}/surah/${verse.chapter_id}#verse-${verse.verse_number}`
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        throw new Error('Web Share API not supported');
      }
    } catch (error) {
      console.error('Error sharing: ', error);
      // Fallback - copy to clipboard if sharing fails
      await handleCopy();
    }
  };

  // Audio playback function
  const handleAudioClick = () => {
    try {
      // If this verse is already playing, stop it
      if (audioManager.isPlaying(verseId)) {
        if (audioManager.currentAudio) {
          audioManager.currentAudio.pause();
          audioManager.currentAudio.currentTime = 0;
          audioManager.setCurrentAudio(null, null);
          setIsPlaying(false);
        }
        return;
      }
      
      // Otherwise, start playing this verse's audio
      setIsLoading(true);
      
      // Get chapter ID from the URL path
      const pathSegments = window.location.pathname.split('/');
      const chapterId = pathSegments[pathSegments.length - 1]; // Last segment should be the chapter ID
      
      // Get verse number from the DOM element's ID or use a fallback
      const verseContainer = document.getElementById(`verse-${verse?.verse_number}`) || document.querySelector('.verse-container');
      const verseIdElement = verseContainer?.id;
      const verseNumber = verseIdElement ? verseIdElement.replace('verse-', '') : null;
      
      console.log(`URL-extracted values: Chapter=${chapterId}, Verse=${verseNumber}`);
      
      if (!chapterId || !verseNumber) {
        console.error('Could not determine chapter or verse number from URL/DOM');
        setIsLoading(false);
        return;
      }
      
      // Create a new audio element
      const audio = new Audio();
      
      // Format the URL with leading zeros
      const paddedChapter = String(chapterId).padStart(3, '0');
      const paddedVerse = String(verseNumber).padStart(3, '0');
      
      const audioUrl = `https://everyayah.com/data/Alafasy_128kbps/${paddedChapter}${paddedVerse}.mp3`;
      console.log(`Loading audio from: ${audioUrl}`);
      
      audio.src = audioUrl;
      
      // Stop other audio through the manager before playing this one
      audioManager.setCurrentAudio(audio, verseId);
      
      // Add event listeners
      audio.addEventListener('playing', () => {
        console.log(`Playing audio for Chapter ${chapterId}, Verse ${verseNumber}`);
        setIsPlaying(true);
        setIsLoading(false);
      });
      
      audio.addEventListener('ended', () => {
        console.log(`Audio finished for Chapter ${chapterId}, Verse ${verseNumber}`);
        setIsPlaying(false);
        // Clear from audio manager when done
        if (audioManager.currentVerseId === verseId) {
          audioManager.setCurrentAudio(null, null);
        }
      });
      
      audio.addEventListener('pause', () => {
        console.log(`Audio paused for Chapter ${chapterId}, Verse ${verseNumber}`);
        setIsPlaying(false);
      });
      
      audio.addEventListener('error', () => {
        console.error(`Error playing audio for Chapter ${chapterId}, Verse ${verseNumber}`);
        setIsLoading(false);
        setIsPlaying(false);
        
        // Try an alternative source if the main one fails
        const backupUrl = `https://audio.qurancdn.com/Alafasy/${paddedChapter}${paddedVerse}.mp3`;
        console.log(`Trying alternative source: ${backupUrl}`);
        
        audio.src = backupUrl;
        audio.load();
        audio.play().catch(err => {
          console.error('Alternative source also failed:', err);
          // Clear from audio manager when failed
          if (audioManager.currentVerseId === verseId) {
            audioManager.setCurrentAudio(null, null);
          }
        });
      });
      
      // Play with error handling
      audio.play().catch(error => {
        console.error('Error playing audio:', error);
        setIsLoading(false);
        setIsPlaying(false);
        
        // Clear from audio manager when failed
        if (audioManager.currentVerseId === verseId) {
          audioManager.setCurrentAudio(null, null);
        }
      });
    } catch (e) {
      console.error('Error in audio playback:', e);
      setIsLoading(false);
      setIsPlaying(false);
    }
  };

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
        <div className="flex flex-wrap gap-3 justify-end items-center">
          <button 
            className="icon-btn hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full p-2" 
            onClick={handleShare}
            title="Share verse"
          >
            <Share2 className="h-5 w-5" />
          </button>
          <BookmarkButton verseKey={`${verse.chapter_id}:${verse.verse_number}`} />
          <div className="relative">
            <button
              onClick={handleAudioClick}
              className={`icon-btn hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full p-2 ${
                isPlaying ? 'text-teal-500 dark:text-teal-400' : ''
              }`}
              title={isPlaying ? "Pause audio" : "Play audio"}
              disabled={isLoading}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </button>
          </div>
          <div className="relative">
            <button 
              className="icon-btn hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full p-2" 
              onClick={handleCopy}
              title="Copy verse"
            >
              <Copy className="h-5 w-5" />
            </button>
            {copyFeedback && (
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1">
                {copyFeedback}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}