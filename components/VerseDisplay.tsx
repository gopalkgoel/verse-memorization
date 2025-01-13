import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Verse } from '@/types';

interface VerseDisplayProps {
  verse: Verse;
}

const VerseDisplay = ({ verse }: VerseDisplayProps) => {
  return (
    <div className="max-w-2xl mx-auto rounded-lg border border-slate-200 bg-white shadow">
      <div className="flex items-center justify-between border-b border-slate-200 p-4">
        <div className="space-x-2">
          {verse.numbers.map((num) => (
            <span key={num} className="text-sm font-medium bg-slate-100 px-2 py-1 rounded">
              {num}
            </span>
          ))}
        </div>
        {verse.link && (
          <a
            href={verse.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-slate-700"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
      
      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <pre className="whitespace-pre-wrap font-serif text-lg leading-relaxed">
            {verse.verse}
          </pre>
          <pre className="whitespace-pre-wrap text-slate-600">
            {verse.translation}
          </pre>
        </div>
        
        {verse.insights && verse.insights.length > 0 && (
          <div className="pt-4 border-t border-slate-200">
            <h3 className="text-sm font-medium text-slate-500 mb-2">Insights</h3>
            <ul className="space-y-2">
              {verse.insights.map((insight, index) => (
                <li key={index} className="text-sm text-slate-600">
                  {insight}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerseDisplay;