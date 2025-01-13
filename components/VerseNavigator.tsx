'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import VerseDisplay from './VerseDisplay';
import CommandPalette from './CommandPalette';
import type { Verse } from '../types';

interface VerseNavigatorProps {
  verses: Verse[];
}

const VerseNavigator = ({ verses }: VerseNavigatorProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = () => {
    if (currentIndex < verses.length - 1) {
      setCurrentIndex(curr => curr + 1);
      saveLastViewedVerse(currentIndex + 1);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(curr => curr - 1);
      saveLastViewedVerse(currentIndex - 1);
    }
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'ArrowRight') {
      goToNext();
    } else if (event.key === 'ArrowLeft') {
      goToPrevious();
    }
  };

  const saveLastViewedVerse = (index: number) => {
    localStorage.setItem('lastViewedVerse', String(index));
  };

  useEffect(() => {
    // Load last viewed verse from localStorage
    const lastViewed = localStorage.getItem('lastViewedVerse');
    if (lastViewed) {
      const index = parseInt(lastViewed);
      if (index >= 0 && index < verses.length) {
        setCurrentIndex(index);
      }
    }

    // Add keyboard event listeners
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [verses.length]);

  if (verses.length === 0) {
    return <div className="text-center p-4">No verses available</div>;
  }

  return (
    <div className="relative w-full">
      <CommandPalette 
        verses={verses} 
        onVerseSelect={(index) => {
          setCurrentIndex(index);
          saveLastViewedVerse(index);
        }} 
      />
      
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={goToPrevious}
          disabled={currentIndex === 0}
          className="p-2 rounded hover:bg-slate-100 disabled:opacity-50"
          aria-label="Previous verse"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <span className="text-sm text-slate-500">
          {currentIndex + 1} / {verses.length}
        </span>
        <button
          onClick={goToNext}
          disabled={currentIndex === verses.length - 1}
          className="p-2 rounded hover:bg-slate-100 disabled:opacity-50"
          aria-label="Next verse"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
      
      <VerseDisplay verse={verses[currentIndex]} />
      
      <div className="mt-4 text-center text-sm text-slate-500">
        Use ← and → arrow keys or buttons to navigate • Press ⌘K to search
      </div>
    </div>
  );
};

export default VerseNavigator;