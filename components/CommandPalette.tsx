'use client';

import React, { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { Search } from 'lucide-react';
import type { Verse } from '../types';

interface CommandPaletteProps {
  verses: Verse[];
  onVerseSelect: (index: number) => void;
}

const CommandPalette = ({ verses, onVerseSelect }: CommandPaletteProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  // Toggle the command palette with ⌘K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  // Filter verses based on search
  const filteredVerses = verses.filter((verse) => {
    const searchLower = search.toLowerCase();
    return (
      // Match verse numbers
      verse.numbers.some(num => 
        num.toLowerCase().includes(searchLower)
      ) ||
      // Match verse text or translation
      verse.verse.toLowerCase().includes(searchLower) ||
      verse.translation.toLowerCase().includes(searchLower)
    );
  });

  return (
    <>
      {/* Search Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 right-4 p-2 rounded-lg bg-white shadow border border-slate-200 hover:border-slate-300 flex items-center gap-2 text-sm text-slate-500"
      >
        <Search className="w-4 h-4" />
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden sm:inline ml-2 px-2 py-1 text-xs bg-slate-100 rounded">
          ⌘K
        </kbd>
      </button>

      {/* Command Dialog */}
      <div 
        className={`fixed inset-0 bg-black/50 z-50 ${open ? '' : 'hidden'}`}
        onClick={() => setOpen(false)}
      >
        <div className="fixed inset-x-4 top-8 max-w-2xl mx-auto">
          <Command
            className="w-full bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden"
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setOpen(false);
              }
            }}
          >
            <div 
              className="flex items-center border-b p-2"
              onClick={(e) => e.stopPropagation()}
            >
              <Search className="w-4 h-4 text-slate-500 mr-2" />
              <Command.Input
                autoFocus
                placeholder="Search verses..."
                className="flex-1 outline-none placeholder:text-slate-500"
                value={search}
                onValueChange={setSearch}
              />
            </div>

            <Command.List 
              className="max-h-96 overflow-y-auto p-2"
              onClick={(e) => e.stopPropagation()}
            >
              <Command.Empty className="p-4 text-sm text-slate-500">
                No verses found.
              </Command.Empty>

              {filteredVerses.map((verse, index) => (
                <Command.Item
                  key={verse.numbers[0]}
                  value={verse.numbers[0]}
                  className="p-2 rounded hover:bg-slate-100 cursor-pointer text-sm flex flex-col gap-1"
                  onSelect={() => {
                    onVerseSelect(verses.indexOf(verse));
                    setOpen(false);
                    setSearch('');
                  }}
                >
                  <div className="font-medium">{verse.numbers.join(', ')}</div>
                  <div className="text-slate-500 truncate">{verse.translation}</div>
                </Command.Item>
              ))}
            </Command.List>
          </Command>
        </div>
      </div>
    </>
  );
};

export default CommandPalette;