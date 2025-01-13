'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Edit, Plus } from 'lucide-react';
import VerseDisplay from '@/components/VerseDisplay';
import CommandPalette from '@/components/CommandPalette';
import VerseForm from '@/components/VerseForm';
import type { Verse } from '@/types';

interface VerseNavigatorProps {
  verses: Verse[];
}

const VerseNavigator = ({ verses: initialVerses }: VerseNavigatorProps) => {
  const [verses, setVerses] = useState(initialVerses);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleSaveVerse = async (verse: Verse) => {
    setIsSaving(true);
    setError(null);
    
    try {
      const endpoint = isEditing ? '/api/verses' : '/api/verses';
      const method = isEditing ? 'PUT' : 'POST';
      const body = isEditing ? { verse, index: currentIndex } : verse;
      
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save verse');
      }
      
      // Update local state
      if (isEditing) {
        const newVerses = [...verses];
        newVerses[currentIndex] = verse;
        setVerses(newVerses);
      } else {
        setVerses([...verses, verse]);
        setCurrentIndex(verses.length); // Go to new verse
      }
      
      setIsEditing(false);
      setIsAdding(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save verse');
    } finally {
      setIsSaving(false);
    }
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

  if (isEditing || isAdding) {
    return (
      <div className="relative w-full max-w-2xl mx-auto">
        <VerseForm
          verse={isEditing ? verses[currentIndex] : undefined}
          onSave={handleSaveVerse}
          onCancel={() => {
            setIsEditing(false);
            setIsAdding(false);
            setError(null);
          }}
          isSaving={isSaving}
        />
        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}
      </div>
    );
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
        <div className="flex gap-2">
          <button
            onClick={() => setIsAdding(true)}
            className="p-2 rounded bg-blue-500 text-white hover:bg-blue-600 flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Verse</span>
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={goToPrevious}
            disabled={currentIndex === 0}
            className="p-2 rounded hover:bg-slate-100 disabled:opacity-50"
            aria-label="Previous verse"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500">
              {currentIndex + 1} / {verses.length}
            </span>
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 rounded hover:bg-slate-100"
              title="Edit verse"
            >
              <Edit className="w-4 h-4" />
            </button>
          </div>
          
          <button
            onClick={goToNext}
            disabled={currentIndex === verses.length - 1}
            className="p-2 rounded hover:bg-slate-100 disabled:opacity-50"
            aria-label="Next verse"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
      
      <VerseDisplay verse={verses[currentIndex]} />
      
      <div className="mt-4 text-center text-sm text-slate-500">
        Use ← and → arrow keys or buttons to navigate • Press ⌘K to search
      </div>
    </div>
  );
};

export default VerseNavigator;