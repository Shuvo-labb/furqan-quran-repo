// src/components/BookmarkButton.tsx
'use client';
import { useState } from 'react';
import { Bookmark } from 'lucide-react';

interface BookmarkButtonProps {
  verseKey: string;
}

export default function BookmarkButton({ verseKey }: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // Here you would implement the actual bookmark functionality with your data store
    console.log(`${isBookmarked ? 'Removing' : 'Adding'} bookmark for verse ${verseKey}`);
  };

  return (
    <button 
      onClick={toggleBookmark}
      className={`icon-btn hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all duration-300 ${isBookmarked ? 'text-teal-500 hover:text-teal-600' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
      aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
      title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
    >
      <Bookmark 
        className="h-5 w-5" 
        fill={isBookmarked ? 'currentColor' : 'none'} 
      />
    </button>
  );
}