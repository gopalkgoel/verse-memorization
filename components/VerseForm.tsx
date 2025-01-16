'use client';

import React, { useState } from 'react';
import { Plus, X, Save } from 'lucide-react';
import type { Verse } from '../types';

interface VerseFormProps {
  verse?: Verse;  // If provided, we're editing. If not, we're adding.
  onSave: (verse: Verse) => void;
  onCancel: () => void;
  isSaving?: boolean;
}

const VerseForm = ({ verse, onSave, onCancel, isSaving = false }: VerseFormProps) => {
  const [formData, setFormData] = useState<Verse>({
    id: verse?.id,
    numbers: verse?.numbers || [''],
    verse: verse?.verse || '',
    translation: verse?.translation || '',
    insights: verse?.insights || [],
    link: verse?.link || ''
  });

  const [newInsight, setNewInsight] = useState('');

  const addNumberField = () => {
    setFormData({
      ...formData,
      numbers: [...formData.numbers, '']  // Add a new empty field
    });
  };

  const updateNumber = (index: number, value: string) => {
    const newNumbers = [...formData.numbers];
    newNumbers[index] = value;
    setFormData({ ...formData, numbers: newNumbers });
  };

  const addInsight = () => {
    if (newInsight) {
      setFormData(prevData => ({
        ...prevData,
        insights: [...(prevData.insights || []), newInsight]
      }));
      setNewInsight('');  // Clear the input after adding
    }
  };

  const updateInsight = (index: number, value: string) => {
    const newInsights = [...(formData.insights || [])];
    newInsights[index] = value;
    setFormData({ ...formData, insights: newInsights });
  };

  const removeInsight = (index: number) => {
    setFormData({
      ...formData,
      insights: formData.insights?.filter((_, i) => i !== index) || []
    });
  };

  const removeNumber = (index: number) => {
    setFormData({
      ...formData,
      numbers: formData.numbers.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Add any pending new insight before saving
    if (newInsight) {
      // Need to update formData directly here since setState is async
      const updatedInsights = [...(formData.insights || []), newInsight];
      const cleanedData = {
        ...formData,
        insights: updatedInsights.filter(insight => insight !== ''),
        numbers: formData.numbers.filter(num => num !== '')
      };
      
      if (cleanedData.numbers[0] && cleanedData.verse && cleanedData.translation) {
        onSave(cleanedData);
      }
    } else {
      // No pending insight, just clean and save
      const cleanedData = {
        ...formData,
        insights: (formData.insights || []).filter(insight => insight !== ''),
        numbers: formData.numbers.filter(num => num !== '')
      };

      if (cleanedData.numbers[0] && cleanedData.verse && cleanedData.translation) {
        onSave(cleanedData);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Verse Numbers
        </label>
        <div className="space-y-2">
          {formData.numbers.map((num, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={num}
                onChange={(e) => updateNumber(index, e.target.value)}
                className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., BG 2.7"
                required={index === 0}
                disabled={isSaving}
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeNumber(index)}
                  className="p-2 text-slate-500 hover:text-slate-700 disabled:opacity-50"
                  disabled={isSaving}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={addNumberField}
              className="p-2 text-blue-500 hover:text-blue-700 disabled:opacity-50"
              disabled={isSaving}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Sanskrit Verse
        </label>
        <textarea
          value={formData.verse}
          onChange={(e) => setFormData({ ...formData, verse: e.target.value })}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 font-serif"
          rows={4}
          placeholder="Enter Sanskrit verse text"
          required
          disabled={isSaving}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Translation
        </label>
        <textarea
          value={formData.translation}
          onChange={(e) => setFormData({ ...formData, translation: e.target.value })}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
          placeholder="Enter verse translation"
          required
          disabled={isSaving}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Source Link (optional)
        </label>
        <input
          type="url"
          value={formData.link || ''}
          onChange={(e) => setFormData({ ...formData, link: e.target.value })}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="https://..."
          disabled={isSaving}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Insights
        </label>
        <div className="space-y-2">
          {formData.insights?.map((insight, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={insight}
                onChange={(e) => updateInsight(index, e.target.value)}
                className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isSaving}
              />
              <button
                type="button"
                onClick={() => removeInsight(index)}
                className="p-2 text-slate-500 hover:text-slate-700 disabled:opacity-50"
                disabled={isSaving}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newInsight}
              onChange={(e) => setNewInsight(e.target.value)}
              className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add an insight"
              disabled={isSaving}
            />
            <button
              type="button"
              onClick={addInsight}
              className="p-2 text-blue-500 hover:text-blue-700 disabled:opacity-50"
              disabled={isSaving}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-slate-600 hover:text-slate-800 disabled:opacity-50"
          disabled={isSaving}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2 disabled:opacity-50"
          disabled={isSaving}
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Saving...' : verse ? 'Update Verse' : 'Add Verse'}
        </button>
      </div>
    </form>
  );
};

export default VerseForm;