'use client';

import { useState } from 'react';

export default function ChaptersControls() {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpandedView = () => {
    setIsExpanded(!isExpanded);
    
    // Toggle a class on the chapters grid to change the display
    const chaptersGrid = document.querySelector('.chapters-grid');
    if (chaptersGrid) {
      chaptersGrid.classList.toggle('expanded-view');
    }
  };

  return (
    <div className="flex space-x-4">
      <button 
        className="btn btn-primary"
        onClick={toggleExpandedView}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
        All Chapters
      </button>
    </div>
  );
}