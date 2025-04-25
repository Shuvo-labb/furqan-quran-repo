import { ReactNode } from "react";

export interface Chapter {
    id: number;
    name_simple: string;
    name_arabic?: string;
    translated_name: {
      name: string;
    };
    verses_count: number;
    revelation_place: string | 'makkah' | 'madinah';
  }
  
  export interface Verse {
    audio?: {
        primary: string;
        secondary?: string[];
      };
    text_uthmani: ReactNode;
    id: number;
    chapter_id: number;
    verse_number: number;
    text: string;
    translation?: string;
    transliteration?: string;
  }


  // src/types/index.ts
