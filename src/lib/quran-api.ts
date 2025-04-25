// src/lib/quran-api.ts
import { Chapter, Verse } from '@/types';

const API_BASE_URL = 'https://api.quran.com/api/v4';

interface ApiResponse<T> {
  data: T;
}

interface VersesResponse {
  verses: Verse[];
  pagination: {
    per_page: number;
    current_page: number;
    next_page: number | null;
    total_pages: number;
  };
}

interface AudioResource {
  url: string;
  duration: number;
  format: string;
  reciter_id: number;
}

export const getVerses = async (chapterId: number): Promise<Verse[]> => {
  try {
    // Initialize an empty array to hold all verses
    let allVerses: any[] = [];
    let currentPage = 1;
    let hasMorePages = true;

    // Fetch verses page by page until we've got them all
    while (hasMorePages) {
      const response = await fetch(
        `${API_BASE_URL}/verses/by_chapter/${chapterId}?words=true&audio=1&translations=131&fields=text_uthmani&page=${currentPage}&per_page=50`,
        { cache: 'no-store' } // Disable cache to get fresh data
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch verses: ${response.statusText}`);
      }

      const responseData = await response.json();

      // Log the pagination information for debugging
      console.log(`Fetching page ${currentPage}, pagination:`, responseData.pagination);

      // Improved error handling for empty or malformed responses
      if (!responseData) {
        console.error('Empty API response');
        break;
      }

      // Check if the API structure has changed (data.verses vs verses directly)
      const verses = responseData.verses ||
        (responseData.data && responseData.data.verses) ||
        [];

      if (!Array.isArray(verses)) {
        console.error('Verses is not an array:', verses);
        break;
      }

      // Add this page's verses to our collection
      allVerses = [...allVerses, ...verses];

      // Check if there are more pages to fetch
      if (responseData.pagination && responseData.pagination.next_page) {
        currentPage = responseData.pagination.next_page;
      } else {
        hasMorePages = false;
      }
    }

    console.log(`Fetched a total of ${allVerses.length} verses for chapter ${chapterId}`);

    // Helper function to clean translation text by removing HTML tags and unwanted formatting
    const cleanTranslationText = (text: string): string => {
      if (!text) return '';
      
      // Remove HTML tags like <sup foot_note=76376>1</sup>
      let cleaned = text.replace(/<[^>]*>/g, '');
      
      // Replace backtick quotes like `O Prophet` with regular quotes
      cleaned = cleaned.replace(/`([^`]+)`/g, '"$1"');
      
      // Replace single quotes around words like 'truly' (optional, based on preference)
      cleaned = cleaned.replace(/'([^']+)'/g, '$1');
      
      // Clean up any double spaces that might have been created
      cleaned = cleaned.replace(/\s+/g, ' ').trim();
      
      return cleaned;
    };

    // Helper function to ensure audio URL is properly formatted
    const formatAudioUrl = (url: string): string => {
      if (!url) return '';
      
      // If URL is relative, prepend the API base
      if (url.startsWith('/')) {
        return `https://audio.qurancdn.com${url}`;
      }
      
      // If URL doesn't have a protocol, add https://
      if (!url.startsWith('http')) {
        return `https://${url}`;
      }
      
      return url;
    };

    // Map all the verses to our application's format
    return allVerses.map((verse: any) => {
      const audioResources: AudioResource[] = verse.audio || verse.audio_resources || [];
      
      // Directly get audio file URL or extract from resources
      let audioUrl = '';
      if (verse.audio_file && verse.audio_file.url) {
        audioUrl = formatAudioUrl(verse.audio_file.url);
      } else if (audioResources.length > 0) {
        const primaryAudio = audioResources.find(res => res.format === 'mp3');
        if (primaryAudio && primaryAudio.url) {
          audioUrl = formatAudioUrl(primaryAudio.url);
        }
      }

      // Log audio URL for debugging
      if (audioUrl) {
        console.log(`Verse ${verse.verse_number} audio URL: ${audioUrl}`);
      } else {
        console.log(`No audio URL found for verse ${verse.verse_number}`);
      }

      // Clean up translation text
      const rawTranslation = verse.translations?.[0]?.text || '';
      const cleanedTranslation = cleanTranslationText(rawTranslation);

      return {
        id: verse.id,
        chapter_id: verse.chapter_id,
        verse_number: verse.verse_number,
        text_uthmani: verse.text_uthmani,
        text: verse.text_uthmani, // Adding the text property with text_uthmani value
        translation: cleanedTranslation,
        audio: audioUrl ? {
          primary: audioUrl
        } : undefined,
        words: verse.words?.map((word: any) => ({
          id: word.id,
          position: word.position,
          text: word.text_uthmani,
          translation: word.translation?.text
        }))
      };
    });
  } catch (error) {
    console.error('Error fetching verses:', error);
    return []; // Return empty array instead of throwing to prevent page crashes
  }
};

// Utility function for fetching chapters (if not already implemented)
export const getChapters = async (): Promise<Chapter[]> => {
  const response = await fetch(`${API_BASE_URL}/chapters?language=en`);
  const { chapters } = await response.json();
  return chapters;
};

// Utility function for fetching a single chapter
export const getChapter = async (id: number): Promise<Chapter> => {
  try {
    const response = await fetch(`${API_BASE_URL}/chapters/${id}?language=en`, {
      cache: 'no-store' // Disable cache to get fresh data
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch chapter: ${response.statusText}`);
    }

    const responseData = await response.json();

    // Log the raw response data for debugging
    console.log('Chapter API Response:', JSON.stringify(responseData));

    if (!responseData) {
      throw new Error('Empty API response for chapter');
    }

    // Check if the API structure has the expected format
    const chapter = responseData.chapter;

    if (!chapter) {
      throw new Error('Chapter data not found in API response');
    }

    return chapter;
  } catch (error) {
    console.error('Error fetching chapter:', error);
    // Return a minimal chapter object to prevent UI crashes
    return {
      id: id,
      name_simple: 'Chapter ' + id,
      name_arabic: '',
      translated_name: { name: 'Loading failed' },
      verses_count: 0,
      revelation_place: '',
      bismillah_pre: false
    } as Chapter;
  }
};