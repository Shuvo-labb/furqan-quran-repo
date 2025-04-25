'use client';
import { Chapter } from '@/types';
import { Play, Pause, Loader2, BookOpen, MapPin, XCircle } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface ChapterHeaderProps {
  chapter: Chapter;
}

export default function ChapterHeader({ chapter }: ChapterHeaderProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioAvailable, setAudioAvailable] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Clear any previously stored unavailable flags for testing
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('audio_unavailable_')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
    }
  }, []);

  useEffect(() => {
    // Always start fresh when the chapter changes
    setIsPlaying(false);
    setIsLoading(false);
    setAudioAvailable(true);
    
    // Clean up any existing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
    
    try {
      // Hardcode a guaranteed working audio source
      // This URL format works consistently across all chapters
      const paddedId = chapter.id.toString().padStart(3, '0');
      const audioUrl = `https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/${paddedId}.mp3`;
      
      console.log(`Loading chapter audio: ${audioUrl}`);
      const audioElement = new Audio(audioUrl);
      
      // Configure audio
      audioElement.preload = 'auto'; // Force preloading
      audioRef.current = audioElement;
      
      // Event listeners
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      const handleEnded = () => setIsPlaying(false);
      const handleWaiting = () => setIsLoading(true);
      const handleCanplay = () => {
        console.log("Chapter audio ready to play"); 
        setIsLoading(false);
        setAudioAvailable(true);
      };
      
      const handleError = (e: Event) => {
        console.log(`Error loading audio for chapter ${chapter.id}`);
        
        // Try fallback URL
        const fallbackUrl = `https://verses.quran.com/Alafasy/${paddedId}.mp3`;
        console.log(`Trying fallback URL: ${fallbackUrl}`);
        
        audioElement.src = fallbackUrl;
        audioElement.load();
      };
      
      // Add event listeners
      audioElement.addEventListener('play', handlePlay);
      audioElement.addEventListener('pause', handlePause);
      audioElement.addEventListener('ended', handleEnded);
      audioElement.addEventListener('waiting', handleWaiting);
      audioElement.addEventListener('canplay', handleCanplay);
      audioElement.addEventListener('error', handleError);
      
      // Try loading the audio
      audioElement.load();
      
      return () => {
        audioElement.removeEventListener('play', handlePlay);
        audioElement.removeEventListener('pause', handlePause);
        audioElement.removeEventListener('ended', handleEnded);
        audioElement.removeEventListener('waiting', handleWaiting);
        audioElement.removeEventListener('canplay', handleCanplay);
        audioElement.removeEventListener('error', handleError);
        audioElement.pause();
        audioElement.src = '';
      };
    } catch (err) {
      console.log("Error setting up chapter audio:", err);
      setAudioAvailable(false);
      return () => {};
    }
  }, [chapter.id]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      // Stop all other audio elements
      document.querySelectorAll('audio').forEach((audio) => {
        if (audio !== audioRef.current) {
          audio.pause();
        }
      });
      
      setIsLoading(true);
      audioRef.current.play()
        .then(() => {
          console.log('Chapter audio started successfully');
        })
        .catch((err) => {
          console.log('Error playing chapter audio:', err);
          setAudioAvailable(false);
          setIsPlaying(false);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  return (
    <div className="rounded-2xl overflow-hidden mb-8 relative">
      <div className="bg-gradient-to-r from-teal-600 to-teal-500 text-white p-8 relative">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.5)_0,rgba(255,255,255,0)_70%)]"></div>
        
        {/* Chapter information */}
        <div className="flex flex-col items-center text-center mb-10 relative z-1">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/30 backdrop-blur-sm mb-4 shadow-md border border-white/30">
            <span className="text-white text-2xl font-bold">{chapter.id}</span>
          </div>
          <div className="arabic-text text-4xl mb-3">{chapter.name_arabic}</div>
          <h1 className="text-4xl font-bold mb-2">{chapter.name_simple}</h1>
          <p className="text-xl opacity-90">{chapter.translated_name.name}</p>
        </div>
        
        {/* Bottom section with metadata */}
        <div className="flex flex-wrap justify-between items-center w-full text-xl relative z-1 pt-5 border-t border-white/20">
          <div className="flex items-center gap-2 px-2 py-1">
            <BookOpen className="h-5 w-5 opacity-80" />
            <span>{chapter.verses_count} Verses</span>
          </div>
          
          <div className="flex items-center gap-2 px-2 py-1">
            <MapPin className="h-5 w-5 opacity-80" />
            <span className="capitalize">Revealed in {chapter.revelation_place}</span>
          </div>
          
          {audioAvailable ? (
            <button 
              onClick={togglePlayPause}
              disabled={isLoading}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-full backdrop-blur-sm shadow-sm border border-white/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Loading...</span>
                </>
              ) : isPlaying ? (
                <>
                  <Pause className="h-5 w-5" />
                  <span>Pause Audio</span>
                </>
              ) : (
                <>
                  <Play className="h-5 w-5" fill="currentColor" />
                  <span>Play Audio</span>
                </>
              )}
            </button>
          ) : (
            <button
              disabled
              className="flex items-center gap-2 bg-white/10 text-white/50 px-4 py-2 rounded-full backdrop-blur-sm cursor-not-allowed border border-white/10"
              title="Audio not available"
            >
              <XCircle className="h-5 w-5" />
              <span>Audio Unavailable</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}