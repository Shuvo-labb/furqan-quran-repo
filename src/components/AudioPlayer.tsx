// src/components/AudioPlayer.tsx
'use client';
import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Loader2 } from 'lucide-react';

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
    try {
      const chapterVerse = extractChapterVerse(url);
      if (!chapterVerse) {
        // If we can't extract chapter and verse from URL, use it directly
        console.log('Using direct audio URL:', url);
        return [url];
      }
      
      const { chapter, verse } = chapterVerse;
      
      // Create multiple audio source URLs from different CDNs to increase reliability
      return [
        // Primary source (with proper padding for chapter and verse IDs)
        `https://audio.qurancdn.com/Alafasy/${chapter.padStart(3, '0')}${verse.padStart(3, '0')}.mp3`,
        // Backup sources
        `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${chapter}_${verse}.mp3`,
        `https://verses.quran.com/Alafasy/${chapter.padStart(3, '0')}${verse.padStart(3, '0')}.mp3`
      ];
    } catch (error) {
      console.error('Error getting audio sources:', error);
      return [url]; // Fallback to the original URL
    }
  };

  // Function to try loading audio from multiple sources
  const tryLoadingAudio = (sources: string[], index = 0) => {
    if (index >= sources.length || !audioRef.current) {
      setAudioAvailable(false);
      setIsLoading(false);
      return;
    }

    // Set current source
    audioRef.current.src = sources[index];
    
    // Try to load the audio metadata
    audioRef.current.load();

    // Set up one-time event handlers to check if this source works
    const handleCanPlayThis = () => {
      console.log('Audio can play from source:', sources[index]);
      setAudioAvailable(true);
      setIsLoading(false);
      cleanup();
    };

    const handleErrorThis = () => {
      console.log('Failed to load audio from source:', sources[index]);
      // Try next source
      cleanup();
      tryLoadingAudio(sources, index + 1);
    };

    const cleanup = () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('canplaythrough', handleCanPlayThis);
        audioRef.current.removeEventListener('error', handleErrorThis);
      }
    };

    audioRef.current.addEventListener('canplaythrough', handleCanPlayThis, { once: true });
    audioRef.current.addEventListener('error', handleErrorThis, { once: true });
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
    audioRef.current = audioElement;
    
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
    
    // Add event listeners
    audioElement.addEventListener('play', handlePlay);
    audioElement.addEventListener('pause', handlePause);
    audioElement.addEventListener('ended', handleEnded);
    audioElement.addEventListener('waiting', handleWaiting);
    audioElement.addEventListener('canplay', handleCanPlay);
    audioElement.addEventListener('timeupdate', handleTimeUpdate);
    
    // Get audio sources and try to load them
    setIsLoading(true);
    const sources = getAudioSources(audioUrl);
    tryLoadingAudio(sources);
    
    // Set a timeout for loading
    const loadTimeout = setTimeout(() => {
      if (audioElement && audioElement.readyState < 2) {
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
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsLoading(false);
            console.log('Audio playback started successfully');
          })
          .catch(error => {
            console.error('Error playing audio:', error);
            
            // Try to handle "user didn't interact with document first" error
            if (error.name === 'NotAllowedError') {
              console.log('Autoplay prevented: User needs to interact first');
              setIsLoading(false);
            } else {
              setAudioAvailable(false);
              setIsPlaying(false);
              setIsLoading(false);
            }
          });
      }
    }
  };

  // If audio is not available, show a disabled play button instead of X icon
  if (!audioAvailable) {
    return (
      <button 
        className="icon-btn text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50 rounded-full p-2"
        title="Audio not available"
        disabled={true}
      >
        <Play className="h-5 w-5" />
      </button>
    );
  }

  return (
    <button
      onClick={togglePlayPause}
      disabled={isLoading}
      className={`icon-btn hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full p-2 transition-all duration-300 relative ${isPlaying ? 'text-teal-500 hover:text-teal-600' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
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