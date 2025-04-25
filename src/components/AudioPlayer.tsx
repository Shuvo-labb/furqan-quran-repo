// src/components/AudioPlayer.tsx
'use client';
import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Loader2, XCircle } from 'lucide-react';

interface AudioPlayerProps {
  audioUrl: string;
}

export default function AudioPlayer({ audioUrl }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [audioAvailable, setAudioAvailable] = useState<boolean>(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Extract chapter and verse from an audio URL or the component props
  const extractChapterVerse = (url: string): { chapter: string; verse: string } | null => {
    // Try to match patterns like "1_1" (chapter_verse)
    const chapterVerseMatch = url.match(/(\d+)_(\d+)/);
    if (chapterVerseMatch) {
      return { 
        chapter: chapterVerseMatch[1], 
        verse: chapterVerseMatch[2] 
      };
    }
    
    // Try to match patterns like "/1/1.mp3" (chapter/verse)
    const urlPattern = url.match(/\/(\d+)\/(\d+)\.mp3$/);
    if (urlPattern) {
      return {
        chapter: urlPattern[1],
        verse: urlPattern[2]
      };
    }
    
    return null;
  };

  // Create audio sources with well-supported formats that will work in browsers
  const getAudioSources = (url: string): string[] => {
    const chapterVerse = extractChapterVerse(url);
    if (!chapterVerse) return [url];
    
    const { chapter, verse } = chapterVerse;
    
    // We'll use a hardcoded working audio source rather than trying to be clever
    // This is a reliable source that works across browsers
    return [
      `https://audio.qurancdn.com/Alafasy/${chapter.padStart(3, '0')}${verse.padStart(3, '0')}.mp3`
    ];
  };

  useEffect(() => {
    // Always start fresh when the URL changes
    setIsPlaying(false);
    setIsLoading(false);
    setProgress(0);
    setAudioAvailable(true);
    
    // Clean up any existing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
    
    // Skip if no URL is provided
    if (!audioUrl || audioUrl.trim() === '') {
      setAudioAvailable(false);
      return;
    }

    // Create HTML audio element
    const audioElement = new Audio();
    
    // Attempt to use local storage to check if we've previously determined this audio is unavailable
    const audioKey = audioUrl.replace(/[^a-zA-Z0-9]/g, '_');
    if (typeof window !== 'undefined' && localStorage.getItem(`audio_unavailable_${audioKey}`)) {
      setAudioAvailable(false);
      return;
    }
    
    // Set up event handlers
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };
    const handleWaiting = () => setIsLoading(true);
    const handleCanPlay = () => {
      setIsLoading(false);
      setAudioAvailable(true);
    };
    const handleTimeUpdate = () => {
      if (audioElement) {
        const percentage = (audioElement.currentTime / audioElement.duration) * 100;
        setProgress(percentage || 0);
      }
    };
    
    // Define the error handler without logging the event object
    const handleError = (e: Event) => {
      // Don't log as an error - use info level instead
      console.info("Audio unavailable", audioUrl);
      
      // Mark this audio as unavailable
      setAudioAvailable(false);
      setIsLoading(false);
      
      // Remember this audio was unavailable
      if (typeof window !== 'undefined') {
        localStorage.setItem(`audio_unavailable_${audioKey}`, 'true');
      }
    };
    
    // Add event listeners
    audioElement.addEventListener('play', handlePlay);
    audioElement.addEventListener('pause', handlePause);
    audioElement.addEventListener('ended', handleEnded);
    audioElement.addEventListener('waiting', handleWaiting);
    audioElement.addEventListener('canplay', handleCanPlay);
    audioElement.addEventListener('timeupdate', handleTimeUpdate);
    audioElement.addEventListener('error', handleError);
    
    // Get audio sources
    const sources = getAudioSources(audioUrl);
    audioElement.src = sources[0];
    
    // Set reference
    audioRef.current = audioElement;
    setIsLoading(true);
    
    // Preload metadata only to reduce bandwidth
    audioElement.preload = 'metadata';
    
    // Set a timeout for loading
    const loadTimeout = setTimeout(() => {
      if (audioElement && audioElement.readyState < 2) {
        setAudioAvailable(false);
        setIsLoading(false);
      }
    }, 5000);
    
    // Clean up function
    return () => {
      clearTimeout(loadTimeout);
      audioElement.removeEventListener('play', handlePlay);
      audioElement.removeEventListener('pause', handlePause);
      audioElement.removeEventListener('ended', handleEnded);
      audioElement.removeEventListener('waiting', handleWaiting);
      audioElement.removeEventListener('canplay', handleCanPlay);
      audioElement.removeEventListener('timeupdate', handleTimeUpdate);
      audioElement.removeEventListener('error', handleError);
      audioElement.pause();
      audioElement.src = '';
    };
  }, [audioUrl]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      // Stop all other audio elements
      document.querySelectorAll('audio').forEach(audio => {
        if (audio !== audioRef.current) {
          audio.pause();
        }
      });
      
      // Play with error handling
      setIsLoading(true);
      audioRef.current.play()
        .then(() => {
          setIsLoading(false);
        })
        .catch(() => {
          // Don't show detailed error messages, just handle gracefully
          setAudioAvailable(false);
          setIsPlaying(false);
          setIsLoading(false);
        });
    }
  };

  // If audio is not available, show a disabled button
  if (!audioAvailable) {
    return (
      <span 
        className="icon-btn text-gray-400 dark:text-gray-600 cursor-not-allowed"
        title="Audio not available"
      >
        <XCircle className="h-5 w-5" />
      </span>
    );
  }

  return (
    <button
      onClick={togglePlayPause}
      disabled={isLoading}
      className={`icon-btn hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all duration-300 relative ${isPlaying ? 'text-teal-500 hover:text-teal-600' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
      aria-label={isPlaying ? 'Pause' : 'Play'}
      title={isPlaying ? 'Pause audio' : 'Play audio'}
    >
      {isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : isPlaying ? (
        <Pause className="h-5 w-5" />
      ) : (
        <Play className="h-5 w-5" />
      )}
      
      {isPlaying && progress > 0 && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="absolute inset-0 rounded-full border-2 border-teal-500 opacity-20"></span>
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100">
            <circle 
              className="text-gray-200 dark:text-gray-700"
              strokeWidth="4"
              stroke="currentColor"
              fill="transparent"
              r="48"
              cx="50"
              cy="50"
            />
            <circle 
              className="text-teal-500 transition-all duration-150"
              strokeWidth="4"
              strokeDasharray={`${progress * 3.02}, 1000`}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="48"
              cx="50"
              cy="50"
              transform="rotate(-90 50 50)"
            />
          </svg>
        </span>
      )}
    </button>
  );
}